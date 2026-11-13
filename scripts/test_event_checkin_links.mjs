import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import vm from "node:vm"

const require = createRequire(import.meta.url)
const ts = require("typescript")

function loadUtility(relativePath) {
  const filePath = fileURLToPath(new URL(relativePath, import.meta.url))
  const compiled = ts.transpileModule(readFileSync(filePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText
  const loaded = { exports: {} }
  vm.runInNewContext(compiled, {
    module: loaded,
    exports: loaded.exports,
    URL,
  })
  return loaded.exports
}

const { buildCheckInPath, parseCheckInQuery, isAttendanceCode } = loadUtility(
  "../src/utilities/eventCheckInLink.ts",
)
const { safeLocalPath } = loadUtility("../src/utilities/safeLocalPath.ts")
const code = "A".repeat(32)
const path = `/leaderboard?checkin=9&t=${code}`

assert.equal(isAttendanceCode(code), true)
assert.equal(isAttendanceCode("meowmeowmeow"), false)
assert.equal(buildCheckInPath({ eventId: 9, code }), path)
assert.deepEqual(
  JSON.parse(JSON.stringify(parseCheckInQuery({ checkin: "9", t: code }))),
  {
    requested: true,
    link: { eventId: 9, code },
  },
)
assert.deepEqual(JSON.parse(JSON.stringify(parseCheckInQuery({}))), {
  requested: false,
  link: null,
})
for (const query of [
  { checkin: "9" },
  { t: code },
  { checkin: "0", t: code },
  { checkin: "2147483648", t: code },
  { checkin: "9", t: "meowmeowmeow" },
  { checkin: ["9", "10"], t: code },
]) {
  assert.equal(parseCheckInQuery(query).link, null)
}

assert.equal(safeLocalPath(path), path)
assert.equal(
  safeLocalPath(`/profile?next=${encodeURIComponent(path)}`),
  `/profile?next=${encodeURIComponent(path)}`,
)
for (const unsafe of [
  "https://example.com",
  "//example.com",
  "/\\example.com",
  "/\nexample.com",
]) {
  assert.equal(safeLocalPath(unsafe), "/")
}

console.log("Check-in link and post-auth return path checks passed.")
