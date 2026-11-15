import { test } from "node:test"
import { createRequire } from "node:module"
import { safeRedirect } from "../src/utilities/auth.ts"
import assert from "node:assert/strict"
import {
  readUploadForm,
  safeUploadName,
  validSeminarPath,
} from "../src/utilities/uploadValidation.ts"
import { authenticatedAdmin } from "../src/access/authenticatedAdmin.ts"

test("only users-collection accounts receive administrative access", () => {
  for (const user of [null, { id: 1, collection: "club-member" }]) {
    assert.equal(authenticatedAdmin({ req: { user } } as any), false)
  }
  assert.equal(
    authenticatedAdmin({
      req: { user: { id: 1, collection: "users" } },
    } as any),
    true,
  )
})

test("upload paths reject traversal and unsupported terms", () => {
  assert.equal(validSeminarPath("csc", "csca08", "2026", "fall"), true)
  assert.equal(validSeminarPath("../csc", "csca08", "2026", "fall"), false)
  assert.equal(validSeminarPath("csc", "csca08", "2026", "../fall"), false)
  for (const name of ["../test.pdf", "a/b.pdf", "a\\b.pdf", ".gitignore"])
    assert.equal(safeUploadName(name), false)
  assert.equal(safeUploadName("Review 1.pdf"), true)
})

test("multipart limit applies without Content-Length", async () => {
  const form = new FormData()
  form.set("answer", "x".repeat(100))
  const encoded = new Request("http://localhost", {
    method: "POST",
    body: form,
  })
  const request = new Request("http://localhost", {
    method: "POST",
    headers: encoded.headers,
    body: await encoded.arrayBuffer(),
  })
  await assert.rejects(readUploadForm(request, 10), /exceeds/)
  const result = await readUploadForm(
    new Request("http://localhost", { method: "POST", body: form }),
  )
  assert.equal(result.get("answer"), "x".repeat(100))
})

// Resolve Payload's actual transitive copy so the test verifies the applied patch.
const require = createRequire(import.meta.url)
const merge = createRequire(require.resolve("payload"))("deepmerge")
test("deepmerge preserves a safe prototype for hostile keys on either input", () => {
  const hostile = JSON.parse('{"__proto__":{"isAdmin":true}}')
  for (const result of [
    merge(hostile, {}),
    merge(Object.create(null), hostile),
    merge({}, { nested: hostile }).nested,
  ]) {
    assert.equal(Object.getPrototypeOf(result), Object.prototype)
    assert.equal(result.isAdmin, undefined)
  }
  assert.deepEqual(merge({ nested: { a: 1 } }, { nested: { b: 2 } }), {
    nested: { a: 1, b: 2 },
  })
})

test("redirects stay on this origin, including backslash and control-character inputs", () => {
  for (const value of [
    "//evil.example",
    "/\\evil.example",
    "/\t/evil.example",
    "https://evil.example",
    null,
  ])
    assert.equal(safeRedirect(value), "/")
  assert.equal(safeRedirect("/profile?tab=events"), "/profile?tab=events")
})
