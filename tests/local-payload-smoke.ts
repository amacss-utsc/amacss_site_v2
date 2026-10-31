// Run with Payload's TS runner against a disposable localhost database:
// Set DATABASE_URI to localhost/amacss_test and PAYLOAD_SECRET to a local-only
// value starting with amacss-local-, then run:
// npm run payload -- run tests/local-payload-smoke.ts
import assert from "node:assert/strict"
import path from "node:path"
import { createRequire } from "node:module"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { hasEventEnded, pastPinnedEventsWhere } from "@/utilities/eventDates"

const database = new URL(process.env.DATABASE_URI ?? "")
if (
  !["127.0.0.1", "localhost"].includes(database.hostname) ||
  database.pathname !== "/amacss_test"
) {
  throw new Error("This fixture script only runs against localhost/amacss_test")
}
if (!process.env.PAYLOAD_SECRET?.startsWith("amacss-local-")) {
  throw new Error("Set a local-only PAYLOAD_SECRET starting with amacss-local-")
}

const config = await configPromise
const require = createRequire(import.meta.url)
const { Client } = createRequire(require.resolve("@payloadcms/db-postgres"))(
  "pg",
)
const db = new Client({ connectionString: process.env.DATABASE_URI })
await db.connect()
const schemaExists =
  (await db.query("SELECT to_regclass('public.events') AS table_name")).rows[0]
    .table_name !== null
await db.end()
// Seeding runs outside a Next.js request, so disable request-bound invalidation
// hooks here. The running app uses its normal hooks for subsequent HTTP tests.
const payload = await getPayload({
  config: {
    ...config,
    // Bootstrap a fresh database once. Re-pushing an existing schema is neither
    // needed for fixture resets nor reliable with this older Drizzle version.
    db: {
      ...postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URI },
        push: !schemaExists,
      }),
      allowIDOnCreate: false,
      name: "postgres",
    },
    collections: config.collections.map((collection) => ({
      ...collection,
      hooks: { ...collection.hooks, afterChange: [], afterDelete: [] },
    })),
    email: () => ({
      name: "local-test",
      defaultFromAddress: "local@example.test",
      defaultFromName: "Local tests",
      sendEmail: async () => ({}),
    }),
  },
})

const users = await payload.find({
  collection: "users",
  where: { email: { equals: "localadmin@example.test" } },
})
if (!users.docs.length)
  await payload.create({
    collection: "users",
    data: {
      name: "Local Test Admin",
      email: "localadmin@example.test",
      password: "amacss-local-testing-only",
    },
  })
const existing = await payload.find({
  collection: "events",
  where: { title: { equals: "Local expired event" } },
})
if (!existing.docs.length) {
  const media = await payload.create({
    collection: "media",
    data: { alt: "Local test image" },
    filePath: path.resolve("public/static/images/team/jolie-zhu-153.jpg"),
  })
  const eventTag = await payload.create({
    collection: "event-tag",
    data: { eventTag: "Local test" },
  })
  const ribbon = await payload.create({
    collection: "ribbon-tag",
    data: { ribbonTag: "PINNED" },
  })
  const now = Date.now()
  const days = (offset: number) =>
    new Date(now + offset * 86_400_000).toISOString()
  const fixtures = [
    { title: "Local expired event", date: days(-3), endDate: days(-2) },
    { title: "Local ongoing event", date: days(-2), endDate: days(1) },
    { title: "Local current event", date: days(0) },
    { title: "Local future event", date: days(3) },
  ]
  for (const fixture of fixtures)
    await payload.create({
      collection: "events",
      data: {
        ...fixture,
        image: media.id,
        eventTag: [eventTag.id],
        ribbonTag: ribbon.id,
        previewText: "Disposable local test fixture",
        points: 0,
        regStyle: "none",
        onSidebar: true,
        description: {
          root: {
            type: "root",
            version: 1,
            format: "",
            indent: 0,
            direction: null,
            children: [
              {
                type: "paragraph",
                version: 1,
                format: "",
                indent: 0,
                direction: null,
                children: [
                  {
                    type: "text",
                    version: 1,
                    text: "Disposable local fixture",
                    format: 0,
                    style: "",
                    mode: "normal",
                    detail: 0,
                  },
                ],
              },
            ],
          },
        },
      },
    })
  const tag = await payload.create({
    collection: "resource-tag",
    data: { resourceTag: "Local mathematics" },
  })
  await payload.create({
    collection: "resources",
    data: {
      title: "Local test resource",
      description: "Disposable resource for cache tests",
      resourceTags: [tag.id],
      buttonText: "Visit",
      link: "https://example.com",
    },
  })
}

// Reset just the disposable expired fixture so the HTTP cron test is repeatable.
const pinned = await payload.find({
  collection: "ribbon-tag",
  where: { ribbonTag: { equals: "PINNED" } },
})
await payload.update({
  collection: "events",
  where: { title: { equals: "Local expired event" } },
  data: { ribbonTag: pinned.docs[0].id },
})
const now = new Date()
const [events, selected, resources] = await Promise.all([
  payload.find({ collection: "events", pagination: false, depth: 1 }),
  payload.find({
    collection: "events",
    where: pastPinnedEventsWhere(now),
    pagination: false,
    depth: 0,
  }),
  payload.find({
    collection: "resources",
    where: { "resourceTags.resourceTag": { in: ["Local mathematics"] } },
    overrideAccess: false,
  }),
])
const expected = events.docs
  .filter(
    (event) =>
      typeof event.ribbonTag === "object" &&
      event.ribbonTag?.ribbonTag === "PINNED" &&
      hasEventEnded(event, now),
  )
  .map((event) => event.id)
  .sort()
assert.deepEqual(selected.docs.map((event) => event.id).sort(), expected)
assert.equal(selected.docs.length, 1)
assert.equal(selected.docs[0].title, "Local expired event")
assert.equal(resources.docs.length, 1)
console.log(
  JSON.stringify(
    {
      localDatabase: database.pathname.slice(1),
      events: events.docs.length,
      cleanupTargets: selected.docs.map((event) => event.title),
      relationshipFilter: "passed",
    },
    null,
    2,
  ),
)
await payload.db.destroy?.()
process.exit(0)
