const { test } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const ts = require("typescript")
// Next.js installs this global when its server starts; supply the same Node
// implementation when exercising its cache outside the server.
globalThis.AsyncLocalStorage ||= require("node:async_hooks").AsyncLocalStorage
const { unstable_cache } = require("next/cache")

function loadTS(file, mocks) {
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  const loadedModule = { exports: {} }
  new Function("require", "module", "exports", compiled)(
    (name) => {
      if (name in mocks) return mocks[name]
      throw new Error(`Unexpected import ${name} in ${file}`)
    },
    loadedModule,
    loadedModule.exports,
  )
  return loadedModule.exports
}

const cacheConstants = loadTS("src/utilities/contentCacheTags.ts", {})
const calendarUtils = loadTS("src/components/Calendar/utils.ts", {
  "date-fns": require("date-fns"),
})
const eventDates = loadTS("src/utilities/eventDates.ts", {
  "@/components/Calendar/utils": calendarUtils,
})

function matchesWhere(doc, where) {
  if (where.and)
    return where.and.every((condition) => matchesWhere(doc, condition))
  if (where.or)
    return where.or.some((condition) => matchesWhere(doc, condition))
  return Object.entries(where).every(([field, condition]) => {
    const value = field.split(".").reduce((item, part) => item?.[part], doc)
    if ("equals" in condition) return value === condition.equals
    if ("exists" in condition) return (value != null) === condition.exists
    if ("less_than" in condition)
      return value != null && new Date(value) < new Date(condition.less_than)
    throw new Error(`Unexpected condition ${JSON.stringify(condition)}`)
  })
}

test("unpin query and display agree through the final Toronto day and DST", () => {
  for (const [now, cutoff] of [
    ["2026-03-08T16:00:00Z", "2026-03-08T05:00:00.000Z"],
    ["2026-03-09T16:00:00Z", "2026-03-09T04:00:00.000Z"],
    ["2026-11-01T16:00:00Z", "2026-11-01T04:00:00.000Z"],
    ["2026-11-02T16:00:00Z", "2026-11-02T05:00:00.000Z"],
  ])
    assert.equal(
      eventDates.startOfTorontoDay(new Date(now)).toISOString(),
      cutoff,
    )
  const now = new Date("2026-11-01T16:00:00Z")
  const where = eventDates.pastPinnedEventsWhere(now)
  const fixtures = [
    { date: "2026-10-30T16:00:00Z", endDate: null, ended: true },
    { date: "2026-11-01T06:00:00Z", ended: false },
    {
      date: "2026-10-30T16:00:00Z",
      endDate: "2026-11-02T05:00:00Z",
      ended: false,
    },
    {
      date: "2026-10-30T16:00:00Z",
      endDate: "2026-11-01T06:00:00Z",
      ended: false,
    },
    { date: "2026-11-02T16:00:00Z", ended: false },
    {
      date: "2026-10-30T16:00:00Z",
      endDate: "2026-11-01T04:00:00Z",
      ended: false,
    },
    {
      date: "2026-10-30T16:00:00Z",
      endDate: "2026-11-01T03:59:59.999Z",
      ended: true,
    },
    {
      date: "2026-10-30T16:00:00Z",
      endDate: "2026-10-29T16:00:00Z",
      ended: true,
    },
  ]
  for (const fixture of fixtures) {
    const event = { ...fixture, ribbonTag: { ribbonTag: "PINNED" } }
    assert.equal(eventDates.hasEventEnded(event, now), fixture.ended)
    assert.equal(matchesWhere(event, where), fixture.ended)
  }
  assert.equal(eventDates.hasEventEnded({ date: "invalid" }, now), false)
  assert.equal(
    eventDates.hasEventEnded(
      { date: "2026-11-01T06:00:00Z", endDate: "invalid" },
      now,
    ),
    false,
  )
})

test("daily unpin authorizes before DB access and updates only completed events", async () => {
  const previousSecret = process.env.CRON_SECRET
  process.env.CRON_SECRET = "test-cron-secret"
  let databaseReads = 0
  let updateArgs
  const fixtures = [
    { id: 1, date: "2000-01-01T12:00:00Z", ribbonTag: { ribbonTag: "PINNED" } },
    {
      id: 2,
      date: "2000-01-01T12:00:00Z",
      endDate: "2999-01-01T12:00:00Z",
      ribbonTag: { ribbonTag: "PINNED" },
    },
  ]
  const route = loadTS("src/app/(frontend)/apiv2/events/unpin-past/route.ts", {
    "next/server": require("next/server"),
    "@payload-config": { default: {} },
    "@/utilities/eventDates": eventDates,
    payload: {
      getPayload: async () => {
        databaseReads++
        return {
          update: async (args) => {
            updateArgs = args
            return {
              docs: fixtures.filter((doc) => matchesWhere(doc, args.where)),
              errors: [],
            }
          },
        }
      },
    },
  })
  try {
    assert.equal(
      (await route.GET(new Request("https://example.test"))).status,
      401,
    )
    assert.equal(databaseReads, 0)
    const response = await route.GET(
      new Request("https://example.test", {
        headers: { authorization: "Bearer test-cron-secret" },
      }),
    )
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { unpinned: 1 })
    assert.deepEqual(updateArgs.data, { ribbonTag: null })
  } finally {
    if (previousSecret === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = previousSecret
  }
})

test("public-content caches use Next.js cache, expire daily, and invalidate on edits/deletes", async () => {
  const originalCache = globalThis.__incrementalCache
  let clock = 0
  let eventTitle = "Original event"
  let failTags = false
  const reads = []
  const entries = new Map()
  globalThis.__incrementalCache = {
    isOnDemandRevalidate: false,
    generateSimpleCacheKey: async (key) => key,
    get: async (key, context) => {
      assert.equal(context.revalidate, 86400)
      const entry = entries.get(key)
      return entry
        ? {
            value: entry.value,
            isStale: clock - entry.at >= context.revalidate * 1000,
          }
        : null
    },
    set: async (key, value, context) => {
      entries.set(key, { value, tags: context.tags, at: clock })
    },
  }
  const nextCache = {
    unstable_cache,
    revalidateTag: (tag, profile) => {
      assert.deepEqual(profile, { expire: 0 })
      for (const [key, entry] of entries)
        if (entry.tags.includes(tag)) entries.delete(key)
    },
    revalidatePath: () => {},
  }
  const payload = {
    find: async (args) => {
      reads.push(args)
      assert.equal(args.overrideAccess, false)
      if (args.collection === "event-tag" && failTags)
        throw new Error("Temporary outage")
      return {
        docs: [
          {
            id: 1,
            title: eventTitle,
            eventTag: "Seminar",
            resourceTag: "Math",
          },
        ],
      }
    },
    findByID: async (args) => {
      reads.push(args)
      assert.equal(args.overrideAccess, false)
      if (args.id === "404") throw { status: 404 }
      if (args.id === "500") throw new Error("Temporary outage")
      return { id: Number(args.id), title: eventTitle }
    },
  }
  try {
    const content = loadTS("src/utilities/publicContent.ts", {
      "@payload-config": { default: {} },
      payload: { getPayload: async () => payload },
      react: { cache: (fn) => fn },
      "next/cache": nextCache,
      "./contentCacheTags": cacheConstants,
    })
    const hooks = loadTS("src/utilities/invalidateContent.ts", {
      "next/cache": nextCache,
    }).contentInvalidationHooks(
      [cacheConstants.CONTENT_CACHE_TAGS.events],
      ["/events"],
    )

    assert.equal(
      (await content.getPublicEvents({ limit: 40 })).docs[0].title,
      "Original event",
    )
    await content.getPublicEvents({ limit: 40, page: 0 })
    assert.equal(
      reads.length,
      1,
      "equivalent pagination reuses the cached query",
    )
    eventTitle = "Updated event"
    clock = 86399 * 1000
    assert.equal(
      (await content.getPublicEvents({ limit: 40 })).docs[0].title,
      "Original event",
    )
    clock = 86401 * 1000
    assert.equal(
      (await content.getPublicEvents({ limit: 40 })).docs[0].title,
      "Updated event",
    )
    assert.equal(reads.length, 2)

    await content.getPublicEvents({ limit: 40, page: 2 })
    await content.getPublicEvents({
      limit: 40,
      where: { onSidebar: { equals: true } },
    })
    await content.getPublicEvents({
      limit: 40,
      where: { date: { greater_than: "2026-10-01" } },
    })
    assert.equal(
      reads.length,
      5,
      "different pages and filters have separate keys",
    )
    assert.equal((await content.getPublicEvent("1")).title, "Updated event")
    eventTitle = "Edited by admin"
    hooks.afterChange[0]({ doc: { id: 1 } })
    assert.equal(
      (await content.getPublicEvents({ limit: 40 })).docs[0].title,
      "Edited by admin",
    )
    assert.equal((await content.getPublicEvent("1")).title, "Edited by admin")
    const beforeDelete = reads.length
    hooks.afterDelete[0]({ doc: { id: 1 } })
    await content.getPublicEvents({ limit: 40 })
    assert.equal(reads.length, beforeDelete + 1)

    const beforeResources = reads.length
    await content.getPublicResources(100, 0, ["Math", "CS", "Math"])
    await content.getPublicResources(100, 1, ["CS", "Math"])
    assert.equal(reads.length, beforeResources + 1)
    assert.deepEqual(reads.at(-1).where, {
      "resourceTags.resourceTag": { in: ["CS", "Math"] },
    })
    assert.deepEqual(await content.getPublicResourceTags(), ["Math"])
    failTags = true
    await assert.rejects(content.getPublicEventTags(), /Temporary outage/)
    failTags = false
    assert.deepEqual(
      await content.getPublicEventTags(),
      ["Seminar"],
      "outages are not cached",
    )
    assert.equal(await content.getPublicEvent("404"), null)
    await assert.rejects(content.getPublicEvent("500"), /Temporary outage/)
    assert.ok(
      reads.every((r) =>
        ["events", "event-tag", "resources", "resource-tag"].includes(
          r.collection,
        ),
      ),
    )
  } finally {
    globalThis.__incrementalCache = originalCache
  }
})

test("expired pin display is derived after the cached event is read", async () => {
  const OriginalDate = Date
  let clock = Date.parse("2026-10-31T11:00:00Z")
  globalThis.Date = class extends OriginalDate {
    constructor(...args) {
      super(...(args.length ? args : [clock]))
    }
    static now() {
      return clock
    }
  }
  const event = {
    id: 1,
    date: "2026-10-31T12:00:00Z",
    ribbonTag: { ribbonTag: "PINNED" },
  }
  try {
    const data = loadTS("src/app/(frontend)/_data/index.ts", {
      "@payload-config": { default: {} },
      payload: {},
      "@/utilities/eventDates": eventDates,
      "@/utilities/publicContent": {
        getPublicEvents: async () => ({ docs: [event] }),
      },
    })
    assert.equal(
      (await data.FetchEvents()).events.docs[0].ribbonTag.ribbonTag,
      "PINNED",
    )
    clock = Date.parse("2026-11-01T04:00:00Z")
    assert.equal((await data.FetchEvents()).events.docs[0].ribbonTag, null)
    assert.equal(
      event.ribbonTag.ribbonTag,
      "PINNED",
      "the cached record is not mutated",
    )
  } finally {
    globalThis.Date = OriginalDate
  }
})

test("middleware skips anonymous sessions and uses claims while forwarding refreshed cookies", async () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-key"
  let clients = 0
  let claims = 0
  const cookies = new Map()
  const request = {
    cookies: {
      getAll: () => [...cookies].map(([name, value]) => ({ name, value })),
      set: (name, value) => cookies.set(name, value),
    },
  }
  const middleware = loadTS("proxy.ts", {
    "next/server": {
      NextResponse: {
        next: () => ({
          cookies: {
            values: [],
            set(...value) {
              this.values.push(value)
            },
          },
        }),
      },
    },
    "@supabase/ssr": {
      createServerClient: (_url, _key, options) => {
        clients++
        return {
          auth: {
            getClaims: async () => {
              claims++
              options.cookies.setAll([
                {
                  name: "sb-example-auth-token.0",
                  value: "refreshed",
                  options: { httpOnly: true },
                },
              ])
            },
          },
        }
      },
    },
  })
  try {
    await middleware.proxy(request)
    assert.equal(clients, 0)
    cookies.set("unrelated-cookie", "value")
    await middleware.proxy(request)
    assert.equal(clients, 0)
    cookies.set("sb-example-auth-token.0", "expired")
    const response = await middleware.proxy(request)
    assert.equal(claims, 1)
    assert.equal(cookies.get("sb-example-auth-token.0"), "refreshed")
    assert.deepEqual(response.cookies.values, [
      ["sb-example-auth-token.0", "refreshed", { httpOnly: true }],
    ])
    const matcher = new RegExp(`^${middleware.config.matcher[0]}$`)
    for (const route of [
      "/api/events",
      "/apiv2/registrations",
      "/admin",
      "/admin/collections/events",
    ])
      assert.equal(matcher.test(route), false)
    for (const route of ["/events", "/profile", "/register/event/1"])
      assert.equal(matcher.test(route), true)
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl
    if (previousKey === undefined)
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey
  }
})

test("browser auth initializes from INITIAL_SESSION without a getUser request", () => {
  let userState
  let authCallback
  let cleanup
  let unsubscribed = false
  const react = {
    createContext: () => ({ Provider: "provider" }),
    useMemo: (fn) => fn(),
    useState: () => [
      null,
      (value) => {
        userState = value
      },
    ],
    useEffect: (fn) => {
      cleanup = fn()
    },
    useCallback: (fn) => fn,
  }
  const auth = loadTS("src/providers/Auth/index.tsx", {
    react,
    "react/jsx-runtime": require("react/jsx-runtime"),
    "@/utilities/auth": { isValidStudyYear: (year) => year >= 1 && year <= 6 },
    "@/utilities/supabase/client": {
      hasSupabaseBrowserConfig: () => true,
      createSupabaseBrowserClient: () => ({
        auth: {
          onAuthStateChange: (callback) => {
            authCallback = callback
            return {
              data: {
                subscription: {
                  unsubscribe: () => {
                    unsubscribed = true
                  },
                },
              },
            }
          },
        },
      }),
    },
  })
  auth.AuthProvider({ children: null })
  authCallback("INITIAL_SESSION", {
    user: {
      id: "member",
      email: "member@example.test",
      user_metadata: { full_name: "Test Member", year_of_study: 2 },
    },
  })
  assert.equal(userState.fullName, "Test Member")
  authCallback("SIGNED_OUT", null)
  assert.equal(userState, null)
  cleanup()
  assert.equal(unsubscribed, true)
})
