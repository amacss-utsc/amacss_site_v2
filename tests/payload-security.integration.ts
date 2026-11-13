import assert from "node:assert/strict"
import { randomUUID, pbkdf2Sync } from "node:crypto"
import { sql } from "@payloadcms/db-postgres"
import { getPayload } from "payload"
import config from "../src/payload.config"
if (
  !["localhost", "127.0.0.1"].includes(
    new URL(process.env.DATABASE_URI || "").hostname,
  )
) {
  throw new Error(
    "Security integration tests require a local disposable database.",
  )
}
const payload = await getPayload({ config })
const suffix = randomUUID()
let adminId: number | undefined
let memberId: number | undefined
const password = "SecuritySmokeTest-LocalOnly-42!"
try {
  // Exercise storage-plugin fields even with an empty media table. Disabling S3
  // in CI would hide missing columns used by populated public event reads.
  await payload.find({ collection: "media", overrideAccess: false, limit: 1 })
  const admin = await payload.create({
    collection: "users",
    data: { email: `admin-${suffix}@example.invalid`, password },
  })
  adminId = admin.id
  const member = await payload.create({
    collection: "club-member",
    data: {
      email: `member-${suffix}@example.invalid`,
      password,
      firstName: "Test",
      lastName: "Member",
    },
  })
  memberId = member.id
  const user = { ...member, collection: "club-member" as const }
  const denied = async (fn: () => Promise<any>) =>
    assert.rejects(fn, (e: any) => e.status === 403)
  await denied(() =>
    payload.find({ collection: "club-member", overrideAccess: false }),
  )
  await denied(() =>
    payload.create({
      collection: "club-member",
      overrideAccess: false,
      data: {
        email: "anonymous@example.invalid",
        password,
        firstName: "Test",
        lastName: "Member",
      },
    }),
  )
  await denied(() =>
    payload.update({
      collection: "club-member",
      id: member.id,
      overrideAccess: false,
      data: { firstName: "Changed" },
    }),
  )
  await denied(() =>
    payload.delete({
      collection: "club-member",
      id: member.id,
      overrideAccess: false,
    }),
  )
  await denied(() =>
    payload.create({
      collection: "users",
      user,
      overrideAccess: false,
      data: { email: "escalation@example.invalid", password },
    }),
  )
  await denied(() =>
    payload.find({ collection: "users", user, overrideAccess: false }),
  )
  await denied(() =>
    payload.find({ collection: "registrations", user, overrideAccess: false }),
  )
  await denied(() =>
    payload.create({
      collection: "events",
      user,
      overrideAccess: false,
      data: {
        title: "Unauthorized",
        points: 0,
        date: new Date().toISOString(),
        previewText: "Test",
        image: 1,
        eventTag: [1],
        description: {
          root: {
            type: "root",
            children: [],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
      },
    }),
  )
  const allowed = await payload.find({
    collection: "users",
    user: { ...admin, collection: "users" as const },
    overrideAccess: false,
    where: { id: { equals: admin.id } },
  })
  assert.equal(allowed.docs.length, 1)
  const privateTables = [
    "users",
    "users_sessions",
    "club_member",
    "club_member_roles",
    "club_member_sessions",
    "registrations",
    "registrations_answers",
    "payload_migrations",
    "payload_kv",
    "payload_preferences",
    "payload_preferences_rels",
    "payload_locked_documents",
    "payload_locked_documents_rels",
  ]
  const secured = await payload.db.drizzle.execute(
    sql`SELECT relname, relrowsecurity FROM pg_class WHERE relnamespace = 'public'::regnamespace AND relkind = 'r'`,
  )
  for (const name of privateTables)
    assert.equal(
      secured.rows.find((r) => r.relname === name)?.relrowsecurity,
      true,
      `${name} must use RLS`,
    )
  const grants = await payload.db.drizzle.execute(sql`
    SELECT c.relname, r.rolname,
      has_table_privilege(r.oid, c.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') AS api_access
    FROM pg_class c CROSS JOIN pg_roles r
    WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'
      AND r.rolname IN ('anon', 'authenticated')
  `)
  for (const name of privateTables) {
    for (const role of ["anon", "authenticated"]) {
      assert.equal(
        grants.rows.find((r) => r.relname === name && r.rolname === role)
          ?.api_access,
        false,
        `${role} must have no direct access to ${name}; create local test roles before migrating`,
      )
    }
  }
  // Real pre-upgrade password format: login must preserve access and strengthen it.
  const salt = randomUUID()
  const legacyHash = pbkdf2Sync(password, salt, 25000, 512, "sha256").toString(
    "hex",
  )
  await payload.db.drizzle.execute(
    sql`UPDATE users SET salt = ${salt}, hash = ${legacyHash} WHERE id = ${admin.id}`,
  )
  const login = await payload.login({
    collection: "users",
    data: { email: admin.email, password },
  })
  assert.ok(login.token)
  const authenticated = await payload.auth({
    headers: new Headers({ authorization: `JWT ${login.token}` }),
  })
  assert.equal(authenticated.user?.id, admin.id)
  assert.equal(authenticated.user?.collection, "users")
  const upgraded = await payload.db.drizzle.execute(
    sql`SELECT hash FROM users WHERE id = ${admin.id}`,
  )
  assert.ok(String(upgraded.rows[0].hash).startsWith("pbkdf2-sha256-v1:"))
  const events = await payload.find({
    collection: "events",
    overrideAccess: false,
  })
  assert.ok(Array.isArray(events.docs))
  console.log(
    "PASS: anonymous/member CRUD denied, escalation denied, admin access and persisted-session login succeed, public event reads succeed",
  )
} finally {
  if (memberId)
    await payload.delete({ collection: "club-member", id: memberId })
  if (adminId) await payload.delete({ collection: "users", id: adminId })
  await payload.destroy()
}
