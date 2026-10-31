const { test } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
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
    generateCacheKey: async (key) => key,
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
    revalidateTag: (tag) => {
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
  const middleware = loadTS("middleware.ts", {
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
    await middleware.middleware(request)
    assert.equal(clients, 0)
    cookies.set("unrelated-cookie", "value")
    await middleware.middleware(request)
    assert.equal(clients, 0)
    cookies.set("sb-example-auth-token.0", "expired")
    const response = await middleware.middleware(request)
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

test("historical cleanup preserves the live roster, shared photos, and unrelated metadata", async () => {
  const { buildTeamCleanupPlan, referencedMedia } = await import(
    path.resolve("scripts/lib/team-cleanup-plan.mjs")
  )
  const snapshot = {
    teams: [
      { id: 1, is_current: false },
      { id: 4, is_current: true },
    ],
    teams_rels: [
      { id: 1, parent_id: 1, sub_teams_id: 1 },
      { id: 2, parent_id: 4, sub_teams_id: 25 },
    ],
    sub_teams: [
      { id: 1, type_id: 1 },
      { id: 25, type_id: 2 },
    ],
    sub_team_types: [{ id: 1 }, { id: 2 }],
    sub_teams_prio_team_members: [
      { id: "old", _parent_id: 1, member_id: 1 },
      { id: "live", _parent_id: 25, member_id: 2 },
    ],
    sub_teams_team_members: [],
    team_members: [
      { id: 1, membership_year: "2025", photo_id: 10 },
      { id: 2, membership_year: "2026", photo_id: 20 },
      { id: 3, membership_year: "2025", photo_id: 30 },
      { id: 4, membership_year: "2025", photo_id: 40 },
      { id: 5, membership_year: "2025", photo_id: 50 },
    ],
    media: [
      { id: 10, filename: "old.jpg" },
      { id: 20, filename: "current.jpg" },
      { id: 30, filename: "shared.jpg" },
      { id: 40, filename: "linked photo.jpg" },
      { id: 50, filename: "rich-text.jpg" },
    ],
    payload_locked_documents: [{ id: 1 }, { id: 2 }],
    payload_locked_documents_rels: [
      { id: 1, parent_id: 1, team_members_id: 1 },
      { id: 2, parent_id: 2, team_members_id: 2 },
    ],
  }
  const protectedIds = new Set([30])
  referencedMedia(
    "https://example.test/linked%20photo.jpg",
    snapshot.media,
    protectedIds,
  )
  referencedMedia(
    { relationTo: "media", value: { id: 50 } },
    snapshot.media,
    protectedIds,
  )
  const plan = buildTeamCleanupPlan(
    snapshot,
    {
      id: "4",
      year: "2026",
      departments: [{ id: "25", priorityMembers: [{ id: "2" }], members: [] }],
    },
    protectedIds,
  )
  assert.deepEqual(
    plan.teams.map((t) => t.id),
    [1],
  )
  assert.deepEqual(
    plan.team_members.map((m) => m.id),
    [1, 3, 4, 5],
  )
  assert.deepEqual(
    plan.media.map((m) => m.id),
    [10],
  )
  assert.deepEqual(
    plan.sub_teams_prio_team_members.map((r) => r.id),
    ["old"],
  )
  assert.deepEqual(
    plan.payload_locked_documents.map((r) => r.id),
    [1],
  )
  assert.deepEqual(
    plan.sub_team_types.map((r) => r.id),
    [1],
  )
})

test("storage cleanup resumes a failed batch from its checkpoint without database rows", async () => {
  const { finishStorageCleanup } = await import(
    path.resolve("scripts/lib/team-cleanup-storage.mjs")
  )
  const files = Array.from({ length: 53 }, (_, index) => `photo-${index}.jpg`)
  const existing = new Set(files)
  let persisted = []
  let calls = 0
  let simulateFailure = true
  const storage = {
    remove: async (batch) => {
      calls++
      if (calls === 2 && simulateFailure)
        return { error: { message: "Simulated storage outage" } }
      batch.forEach((file) => existing.delete(file))
      return { error: null }
    },
  }
  const options = {
    storage,
    files,
    saveProgress: async (done) => {
      persisted = done
    },
  }
  await assert.rejects(
    finishStorageCleanup(options),
    /Simulated storage outage/,
  )
  assert.equal(persisted.length, 50)
  assert.equal(existing.size, 3)
  simulateFailure = false
  const completed = await finishStorageCleanup({
    ...options,
    completedFiles: persisted,
  })
  assert.equal(calls, 3, "the completed first batch is not repeated")
  assert.equal(completed.length, 53)
  assert.equal(existing.size, 0)
  await finishStorageCleanup({ ...options, completedFiles: completed })
  assert.equal(
    calls,
    3,
    "a completed manifest does not make more storage calls",
  )
})

test("storage cleanup refuses a file that has become referenced again", async () => {
  const { finishStorageCleanup } = await import(
    path.resolve("scripts/lib/team-cleanup-storage.mjs")
  )
  let removals = 0
  await assert.rejects(
    finishStorageCleanup({
      storage: {
        remove: async () => {
          removals++
          return { error: null }
        },
      },
      files: ["restored.jpg"],
      beforeDelete: async () => {
        throw new Error("Media record restored")
      },
      saveProgress: async () => {},
    }),
    /Media record restored/,
  )
  assert.equal(removals, 0)
})

test("resume CLI finishes storage cleanup after team rows are gone and rejects a different project", () => {
  const { spawnSync } = require("node:child_process")
  const { tmpdir } = require("node:os")
  const directory = fs.mkdtempSync(path.join(tmpdir(), "amacss-resume-test-"))
  const manifestPath = path.join(directory, "plan.json")
  const preloadPath = path.join(directory, "fake-storage.mjs")
  const files = Array.from(
    { length: 53 },
    (_, index) => `resume-file-${index}.png`,
  )
  fs.writeFileSync(
    manifestPath,
    JSON.stringify({
      summary: { host: "cleanup-test.supabase.co" },
      bucket: "test-bucket",
      files,
      rows: {
        media: files.map((filename, index) => ({ id: index + 1, filename })),
      },
    }),
  )
  fs.writeFileSync(
    preloadPath,
    `
    globalThis.fetch = async (input, init = {}) => {
      const url = new URL(typeof input === 'string' ? input : input.url || String(input));
      const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });
      if (url.hostname === 'www.amacss.org' && url.pathname === '/team') return new Response('<html>Current local roster</html>');
      if (url.hostname !== 'cleanup-test.supabase.co') throw new Error('Unexpected network host');
      if (['/rest/v1/media','/rest/v1/events','/rest/v1/resources','/rest/v1/registrations_answers','/rest/v1/events_registration_form'].includes(url.pathname)) return json([]);
      if (url.pathname === '/storage/v1/object/test-bucket' && init.method === 'DELETE') {
        const batch = JSON.parse(init.body).prefixes;
        if (process.env.TEST_FAIL_STORAGE === '1' && batch.includes('resume-file-50.png')) return json({ message: 'Simulated storage outage', error: 'Storage outage', statusCode: '503' }, 503);
        return json(batch.map(name => ({ name })));
      }
      throw new Error('Unexpected request: ' + url.pathname);
    };
  `,
  )
  const env = {
    ...process.env,
    SUPABASE_URL: "https://cleanup-test.supabase.co",
    SUPABASE_KEY: "local-fixture-key",
    SUPABASE_SECRET_KEY: "",
    S3_BUCKET: "test-bucket",
    TEST_FAIL_STORAGE: "1",
  }
  const args = [
    "--import",
    preloadPath,
    "scripts/cleanup-team-history.mjs",
    "--resume",
    manifestPath,
    "--apply",
  ]
  try {
    const failed = spawnSync(process.execPath, args, {
      env,
      encoding: "utf8",
      timeout: 15000,
    })
    assert.equal(failed.status, 1, failed.stderr)
    const progress = () =>
      JSON.parse(
        fs.readFileSync(path.join(directory, "storage-progress.json"), "utf8"),
      ).completedFiles
    assert.equal(progress().length, 50)
    const wrongProject = spawnSync(process.execPath, args, {
      env: { ...env, SUPABASE_URL: "https://other-project.supabase.co" },
      encoding: "utf8",
      timeout: 15000,
    })
    assert.equal(wrongProject.status, 1)
    assert.match(wrongProject.stderr, /Manifest project\/bucket does not match/)
    assert.equal(progress().length, 50)
    const resumed = spawnSync(process.execPath, args, {
      env: { ...env, TEST_FAIL_STORAGE: "0" },
      encoding: "utf8",
      timeout: 15000,
    })
    assert.equal(resumed.status, 0, resumed.stderr)
    assert.equal(progress().length, 53)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

test("explicit retirement removes current backend records while preserving shared media", async () => {
  const { buildTeamCleanupPlan } = await import(
    path.resolve("scripts/lib/team-cleanup-plan.mjs")
  )
  const snapshot = {
    teams: [{ id: 4, is_current: true }],
    teams_rels: [{ id: 1, parent_id: 4, sub_teams_id: 25 }],
    sub_teams: [{ id: 25, type_id: 2 }],
    sub_team_types: [{ id: 2 }],
    sub_teams_prio_team_members: [{ id: "live", _parent_id: 25, member_id: 2 }],
    sub_teams_team_members: [],
    team_members: [
      { id: 2, membership_year: "2026", photo_id: 20 },
      { id: 3, membership_year: "2026", photo_id: 30 },
    ],
    media: [
      { id: 20, filename: "copied-local.jpg" },
      { id: 30, filename: "shared-event.jpg" },
    ],
    payload_locked_documents: [],
    payload_locked_documents_rels: [],
  }
  const current = {
    id: "4",
    year: "2026",
    departments: [
      { id: "25", priorityMembers: [{ id: "2" }], members: [{ id: "3" }] },
    ],
  }
  const protectedIds = new Set([30])
  const retained = buildTeamCleanupPlan(
    snapshot,
    current,
    new Set(protectedIds),
  )
  assert.equal(retained.team_members.length, 0)
  const retired = buildTeamCleanupPlan(snapshot, current, protectedIds, {
    retireCurrent: true,
  })
  assert.equal(retired.teams.length, 1)
  assert.equal(retired.sub_teams.length, 1)
  assert.equal(retired.sub_team_types.length, 1)
  assert.equal(retired.team_members.length, 2)
  assert.equal(retired.sub_teams_prio_team_members.length, 1)
  assert.deepEqual(
    retired.media.map((row) => row.id),
    [20],
  )
})
