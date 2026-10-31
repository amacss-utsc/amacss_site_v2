const { test } = require("node:test")
const assert = require("node:assert/strict")
const { createRequire } = require("node:module")
const payloadRequire = createRequire(require.resolve("payload"))
const deepmerge = payloadRequire("deepmerge")

test("patched deepmerge rejects prototype poisoning from either operand", () => {
  const malicious = JSON.parse('{"__proto__":{"isAdmin":true},"safe":{"value":1}}')
  for (const [target, source] of [
    [Object.create(null), malicious],
    [malicious, {}],
    [{ nested: Object.create(null) }, { nested: malicious }],
    [{ nested: malicious }, { nested: { extra: 2 } }],
  ]) {
    const result = deepmerge(target, source)
    for (const object of [result, result.nested].filter(Boolean)) {
      assert.equal(Object.getPrototypeOf(object), Object.prototype)
      assert.equal(object.isAdmin, undefined)
      assert.equal(Object.hasOwn(object, "__proto__"), false)
    }
    assert.equal({}.isAdmin, undefined)
  }
  assert.deepEqual(deepmerge({ settings: { a: 1 }, items: [1] }, { settings: { b: 2 }, items: [2] }), {
    settings: { a: 1, b: 2 }, items: [1, 2],
  })
})

test("KaTeX renders equations and rejects trust inherited from options", async () => {
  const { default: katex } = await import("katex")
  assert.match(katex.renderToString("x^2 + y^2 = z^2"), /katex/)
  const html = katex.renderToString(String.raw`\href{javascript:alert(1)}{click}`, Object.create({ trust: true }))
  assert.doesNotMatch(html, /<a[^>]+href=/)
})

test("ESLint import rules use the patched minimatch API", async () => {
  const { ESLint } = require("eslint")
  const eslint = new ESLint({ overrideConfig: [{ rules: {
    "import/no-internal-modules": ["error", { allow: ["@/utilities/**"] }],
    "import/extensions": ["error", "never", { pathGroupOverrides: [{ pattern: "@/**", action: "ignore" }] }],
  } }] })
  const [result] = await eslint.lintText('import { cn } from "@/utilities/cn"\n', { filePath: "src/security-lint-probe.ts" })
  assert.equal(result.fatalErrorCount, 0)
  assert.equal(result.errorCount, 0, JSON.stringify(result.messages))
})
