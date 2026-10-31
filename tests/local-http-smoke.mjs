// Integration checks only for the disposable local database/server.
import assert from "node:assert/strict"
import { createRequire } from "node:module"

const base = process.env.LOCAL_TEST_BASE_URL || "http://localhost:3000"
const database = new URL(process.env.DATABASE_URI || "")
if (
  !["localhost", "127.0.0.1"].includes(new URL(base).hostname) ||
  !["localhost", "127.0.0.1"].includes(database.hostname) ||
  database.pathname !== "/amacss_test"
) {
  throw new Error("HTTP smoke tests only run against localhost and amacss_test")
}
if (!process.env.CRON_SECRET)
  throw new Error("Set the server's local CRON_SECRET")
if (!process.env.PAYLOAD_SECRET?.startsWith("amacss-local-"))
  throw new Error("Set the server's local-only PAYLOAD_SECRET")
const require = createRequire(import.meta.url)
const adapterRequire = createRequire(require.resolve("@payloadcms/db-postgres"))
const { Client } = adapterRequire("pg")
const db = new Client({ connectionString: process.env.DATABASE_URI })
await db.connect()
const request = (path, options = {}) => fetch(new URL(path, base), options)
const page = async (path) => {
  const response = await request(path)
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`)
  return response.text()
}

let token
let resourceId
try {
  const team = await page("/team")
  assert.ok(team.includes("Ibrahim Kasim"))
  assert.ok(team.includes("/static/images/team/"))
  assert.equal(
    (
      await request("/static/images/team/ibrahim-kasim-172.png", {
        method: "HEAD",
      })
    ).status,
    200,
  )
  for (const slug of ["teams", "team-members", "sub-teams", "sub-team-types"]) {
    assert.equal(
      (await request(`/api/${slug}`)).status,
      404,
      `${slug} is no longer registered`,
    )
  }
  await page("/events")
  await page("/calendar")
  await page("/login")
  const profile = await request("/profile", { redirect: "manual" })
  assert.equal(profile.status, 307)
  assert.ok(profile.headers.get("location").startsWith("/login"))

  assert.equal((await request("/apiv2/events/unpin-past")).status, 401)
  const cronOptions = {
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  }
  const first = await request("/apiv2/events/unpin-past", cronOptions)
  assert.equal(first.status, 200)
  assert.deepEqual(await first.json(), { unpinned: 1 })
  const repeated = await request("/apiv2/events/unpin-past", cronOptions)
  assert.equal(repeated.status, 200)
  assert.deepEqual(await repeated.json(), { unpinned: 0 })
  const events = await db.query(
    "SELECT title, ribbon_tag_id FROM events ORDER BY id",
  )
  for (const event of events.rows) {
    assert.equal(
      event.ribbon_tag_id === null,
      event.title === "Local expired event",
      `${event.title}: pin state`,
    )
  }

  const login = await request("/api/users/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "localadmin@example.test",
      password: "amacss-local-testing-only",
    }),
  })
  assert.equal(login.status, 200)
  token = (await login.json()).token
  assert.ok(token)
  const jsonRequest = (path, method, body) =>
    request(path, {
      method,
      headers: {
        "content-type": "application/json",
        authorization: `JWT ${token}`,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
  const { rows: tags } = await db.query(
    "SELECT id FROM resource_tag WHERE resource_tag = 'Local mathematics'",
  )
  const suffix = Date.now()
  const originalTitle = `Local cache probe ${suffix}`
  const editedTitle = `Local admin edited ${suffix}`
  // Warm the list before creating anything to exercise create invalidation.
  await page("/resources")
  const created = await jsonRequest("/api/resources", "POST", {
    title: originalTitle,
    description: "Temporary cache integration probe",
    resourceTags: [tags[0].id],
    buttonText: "Visit",
    link: "https://example.com",
  })
  assert.equal(created.status, 201)
  resourceId = (await created.json()).doc.id
  assert.ok((await page("/resources")).includes(originalTitle))
  // A direct local SQL write bypasses hooks: the next page must still use cache.
  await db.query("UPDATE resources SET title = $1 WHERE id = $2", [
    `Bypassed hook ${suffix}`,
    resourceId,
  ])
  const cached = await page("/resources")
  assert.ok(
    cached.includes(originalTitle),
    "shared content really is cached across HTTP requests",
  )
  assert.ok(!cached.includes(`Bypassed hook ${suffix}`))
  const edited = await jsonRequest(`/api/resources/${resourceId}`, "PATCH", {
    title: editedTitle,
  })
  assert.equal(edited.status, 200)
  assert.ok(
    (await page("/resources")).includes(editedTitle),
    "admin edit invalidates cached content",
  )
  assert.equal(
    (await jsonRequest(`/api/resources/${resourceId}`, "DELETE")).status,
    200,
  )
  resourceId = null
  assert.ok(
    !(await page("/resources")).includes(editedTitle),
    "admin delete invalidates cached content",
  )
  console.log(
    JSON.stringify(
      {
        server: base,
        teamPhotos: "local",
        removedTeamApis: "404",
        anonymousProfile: "redirects to login",
        dailyUnpin: "only expired event; repeat is a no-op",
        resourceCache: "hit, create, edit, and delete verified",
      },
      null,
      2,
    ),
  )
} finally {
  if (resourceId && token)
    await request(`/api/resources/${resourceId}`, {
      method: "DELETE",
      headers: { authorization: `JWT ${token}` },
    })
  await db.end()
}
