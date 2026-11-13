import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import vm from "node:vm"

const require = createRequire(import.meta.url)
const ts = require("typescript")
const routePath = fileURLToPath(
  new URL(
    "../src/app/(frontend)/apiv2/events/[eventId]/check-in/route.ts",
    import.meta.url,
  ),
)
const source = readFileSync(routePath, "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText

const state = {
  user: { id: "6cd8c9fb-cf7c-4492-8a02-d746951b9f70" },
  authError: null,
  rpcResult: {
    data: { status: "claimed", pointsAwarded: 5, pointsBalance: 37 },
    error: null,
  },
  rpcCalls: [],
  invalidations: [],
  cacheFailure: false,
}
const compiledModule = { exports: {} }
const mocks = {
  "next/server": {
    NextResponse: {
      json: (body, options) => ({
        body,
        status: options.status,
        headers: options.headers,
      }),
    },
  },
  "next/cache": {
    revalidateTag: (tag) => {
      if (state.cacheFailure) throw new Error("simulated cache failure")
      state.invalidations.push(tag)
    },
  },
  "@/utilities/supabase/server": {
    createSupabaseServerClient: async () => ({
      auth: {
        getUser: async () => ({
          data: { user: state.user },
          error: state.authError,
        }),
      },
    }),
  },
  "@/utilities/supabase/admin": {
    createSupabaseAdminClient: () => ({
      rpc: async (name, args) => {
        state.rpcCalls.push({ name, args })
        return state.rpcResult
      },
    }),
  },
  "@/utilities/eventCheckInLink": {
    isAttendanceCode: (value) =>
      typeof value === "string" && /^[A-Za-z0-9_-]{32}$/.test(value),
  },
}
vm.runInNewContext(compiled, {
  module: compiledModule,
  exports: compiledModule.exports,
  require: (name) => {
    if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`)
    return mocks[name]
  },
  console: { error: () => {} },
})

const { POST } = compiledModule.exports
const code = "A".repeat(32)
const plain = (value) => JSON.parse(JSON.stringify(value))

async function call({
  eventId = "7",
  body = { attendanceCode: code },
  contentType = "application/json",
} = {}) {
  const request = new Request(
    `http://localhost/apiv2/events/${eventId}/check-in`,
    {
      method: "POST",
      headers: { "content-type": contentType },
      body: typeof body === "string" ? body : JSON.stringify(body),
    },
  )
  return POST(request, { params: Promise.resolve({ eventId }) })
}

function reset() {
  state.user = { id: "6cd8c9fb-cf7c-4492-8a02-d746951b9f70" }
  state.authError = null
  state.rpcResult = {
    data: { status: "claimed", pointsAwarded: 5, pointsBalance: 37 },
    error: null,
  }
  state.rpcCalls = []
  state.invalidations = []
  state.cacheFailure = false
}

reset()
assert.equal((await call({ eventId: "0" })).status, 400)
assert.equal((await call({ eventId: "2147483648" })).status, 400)
assert.equal(state.rpcCalls.length, 0)

reset()
state.user = null
assert.equal((await call()).status, 401)
assert.equal(state.rpcCalls.length, 0)
reset()
state.authError = new Error("expired session")
assert.equal((await call()).status, 401)
assert.equal(state.rpcCalls.length, 0)

reset()
assert.equal((await call({ contentType: "text/plain" })).status, 415)
assert.equal((await call({ body: "{" })).status, 400)
assert.equal((await call({ body: { attendanceCode: "short" } })).status, 400)
assert.equal(
  (await call({ body: { attendanceCode: code, memberId: "someone-else" } }))
    .status,
  400,
)
assert.equal(state.rpcCalls.length, 0)

reset()
const claimed = await call({ contentType: "Application/Json; charset=UTF-8" })
assert.equal(claimed.status, 200)
assert.deepEqual(plain(claimed.body), {
  status: "claimed",
  pointsAwarded: 5,
  pointsBalance: 37,
})
assert.equal(claimed.headers["Cache-Control"], "no-store")
assert.deepEqual(plain(state.rpcCalls), [
  {
    name: "claim_event_attendance",
    args: {
      p_event_id: 7,
      p_member_id: state.user.id,
      p_attendance_code: code,
    },
  },
])
assert.deepEqual(state.invalidations, ["leaderboard"])

reset()
state.rpcResult = { data: { status: "already_claimed" }, error: null }
assert.deepEqual(plain((await call()).body), { status: "already_claimed" })
assert.equal(state.invalidations.length, 0)

for (const [status, expectedCode] of [
  ["invalid_request", 400],
  ["event_not_found", 404],
  ["account_not_found", 401],
  ["profile_missing", 403],
  ["email_unverified", 403],
  ["checkin_closed", 403],
  ["invalid_code", 403],
  ["points_unavailable", 409],
]) {
  reset()
  state.rpcResult = { data: { status }, error: null }
  const response = await call()
  assert.equal(response.status, expectedCode)
  assert.equal(state.invalidations.length, 0)
}

reset()
state.rpcResult = { data: null, error: new Error("simulated RPC failure") }
assert.equal((await call()).status, 500)
reset()
state.rpcResult = { data: { status: "toString" }, error: null }
assert.equal((await call()).status, 500)
reset()
state.rpcResult = {
  data: { status: "claimed", pointsAwarded: -1, pointsBalance: 2 },
  error: null,
}
assert.equal((await call()).status, 500)
reset()
state.cacheFailure = true
assert.equal((await call()).status, 200)

console.log(
  "Check-in API route checks passed (auth, validation, RPC identity, errors, cache behavior).",
)
