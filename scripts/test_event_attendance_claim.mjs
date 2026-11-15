// Run against an empty, disposable local PostgreSQL database named
// event_attendance_test. This script creates tables and roles in that database.
import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const adapterRequire = createRequire(require.resolve("@payloadcms/db-postgres"))
const { Pool } = adapterRequire("pg")

const connectionString =
  process.env.EVENT_ATTENDANCE_TEST_DATABASE_URL ||
  "postgresql://postgres:localtest@127.0.0.1:55432/event_attendance_test"
const target = new URL(connectionString)
if (
  !["127.0.0.1", "localhost"].includes(target.hostname) ||
  target.pathname !== "/event_attendance_test"
) {
  throw new Error(
    "Attendance tests require a local event_attendance_test database.",
  )
}

const pool = new Pool({ connectionString, max: 12 })
const code = "A".repeat(32)
const otherCode = "B".repeat(32)
const migrationPath = fileURLToPath(
  new URL(
    "../supabase/migrations/20261113000000_event_attendance_claim.sql",
    import.meta.url,
  ),
)

async function query(sql, params) {
  return pool.query(sql, params)
}

async function claim(eventId, memberId, attendanceCode = code) {
  const client = await pool.connect()
  try {
    await client.query("begin")
    await client.query("set local role service_role")
    const { rows } = await client.query(
      "select public.claim_event_attendance($1, $2, $3) as result",
      [eventId, memberId, attendanceCode],
    )
    await client.query("commit")
    return rows[0].result
  } catch (error) {
    await client.query("rollback")
    throw error
  } finally {
    client.release()
  }
}

async function createMember({
  email = "member@utoronto.ca",
  verified = true,
  points = 0,
} = {}) {
  const id = randomUUID()
  await query("insert into auth.users (id, email) values ($1, $2)", [id, email])
  await query(
    `insert into public.member_profiles
       (id, email, email_verified_at, points)
     values ($1, $2, $3, $4)`,
    [id, email, verified ? new Date() : null, points],
  )
  return id
}

async function createEvent(
  id,
  points = 5,
  opens = "-1 hour",
  closes = "1 hour",
) {
  await query(
    `insert into public.events
       (id, points, check_in_opens_at, check_in_closes_at, attendance_code)
     values ($1, $2, clock_timestamp() + $3::interval,
             clock_timestamp() + $4::interval, $5)`,
    [id, points, opens, closes, code],
  )
}

async function balance(id) {
  const { rows } = await query(
    "select points from public.member_profiles where id = $1",
    [id],
  )
  return rows[0].points
}

async function attendance(eventId, memberId) {
  const { rows } = await query(
    "select points_awarded from public.event_attendance where event_id = $1 and member_id = $2",
    [eventId, memberId],
  )
  return rows
}

try {
  const { rows: preflight } = await query(
    "select to_regclass('public.events') as events, to_regclass('auth.users') as users",
  )
  assert.equal(preflight[0].events, null, "The test database must be empty")
  assert.equal(preflight[0].users, null, "The test database must be empty")

  await query(`
    create role anon;
    create role authenticated;
    create role service_role;
    create schema auth;
    grant usage on schema public to service_role;
    create table auth.users (id uuid primary key, email text not null);
    create table public.events (
      id integer primary key,
      points numeric not null check (points >= 0 and points = trunc(points)),
      check_in_opens_at timestamptz,
      check_in_closes_at timestamptz,
      attendance_code varchar
    );
    create table public.member_profiles (
      id uuid primary key references auth.users(id),
      email text not null,
      email_verified_at timestamptz,
      points integer not null default 0 check (points >= 0),
      updated_at timestamptz not null default now()
    );
    alter table public.events enable row level security;
    alter table public.member_profiles enable row level security;
  `)
  await query(await readFile(migrationPath, "utf8"))

  const { rows: permissions } = await query(`
    select
      has_function_privilege('anon', 'public.claim_event_attendance(integer, uuid, text)', 'execute') as anon_execute,
      has_function_privilege('authenticated', 'public.claim_event_attendance(integer, uuid, text)', 'execute') as member_execute,
      has_function_privilege('service_role', 'public.claim_event_attendance(integer, uuid, text)', 'execute') as server_execute,
      has_table_privilege('authenticated', 'public.event_attendance', 'insert') as member_insert
  `)
  assert.deepEqual(permissions[0], {
    anon_execute: false,
    member_execute: false,
    server_execute: true,
    member_insert: false,
  })

  const restricted = await pool.connect()
  try {
    await restricted.query("begin")
    await restricted.query("set local role authenticated")
    await assert.rejects(
      restricted.query("select public.claim_event_attendance(1, $1, $2)", [
        randomUUID(),
        code,
      ]),
      { code: "42501" },
    )
  } finally {
    await restricted.query("rollback")
    restricted.release()
  }

  const member = await createMember()
  await createEvent(1, 5)
  assert.equal((await claim(999, member)).status, "event_not_found")
  assert.equal((await claim(1, randomUUID())).status, "account_not_found")
  assert.equal((await claim(1, member, otherCode)).status, "invalid_code")

  const unverified = await createMember({
    email: "unverified@utoronto.ca",
    verified: false,
  })
  assert.equal((await claim(1, unverified)).status, "email_unverified")
  const mismatched = await createMember({ email: "old@utoronto.ca" })
  await query("update auth.users set email = 'new@utoronto.ca' where id = $1", [
    mismatched,
  ])
  assert.equal((await claim(1, mismatched)).status, "email_unverified")
  const outsideDomain = await createMember({ email: "outside@example.com" })
  assert.equal((await claim(1, outsideDomain)).status, "email_unverified")
  const missingProfile = randomUUID()
  await query(
    "insert into auth.users (id, email) values ($1, 'missing@utoronto.ca')",
    [missingProfile],
  )
  assert.equal((await claim(1, missingProfile)).status, "profile_missing")

  await createEvent(2, 5, "1 hour", "2 hours")
  await createEvent(3, 5, "-2 hours", "-1 hour")
  await query(
    "insert into public.events (id, points, attendance_code) values (8, 5, $1)",
    [code],
  )
  assert.equal((await claim(2, member)).status, "checkin_closed")
  assert.equal((await claim(3, member)).status, "checkin_closed")
  assert.equal((await claim(8, member)).status, "checkin_closed")
  assert.equal(await balance(member), 0)

  assert.deepEqual(await claim(1, member), {
    status: "claimed",
    pointsAwarded: 5,
    pointsBalance: 5,
  })
  assert.equal(await balance(member), 5)
  assert.deepEqual(await attendance(1, member), [{ points_awarded: 5 }])
  await query(
    "update public.events set points = 9, check_in_closes_at = now() where id = 1",
  )
  assert.deepEqual(await claim(1, member), {
    status: "already_claimed",
    pointsAwarded: 5,
    pointsBalance: 5,
  })
  assert.equal(await balance(member), 5)

  const simultaneous = await createMember({ email: "simultaneous@utoronto.ca" })
  await createEvent(4, 7)
  const results = await Promise.all(
    Array.from({ length: 8 }, () => claim(4, simultaneous)),
  )
  assert.equal(
    results.filter((result) => result.status === "claimed").length,
    1,
  )
  assert.equal(
    results.filter((result) => result.status === "already_claimed").length,
    7,
  )
  assert.equal((await attendance(4, simultaneous)).length, 1)
  assert.equal(await balance(simultaneous), 7)

  await createEvent(5, 3)
  await createEvent(6, 4)
  const differentEvents = await Promise.all([
    claim(5, simultaneous),
    claim(6, simultaneous),
  ])
  assert.deepEqual(
    differentEvents.map((result) => result.status),
    ["claimed", "claimed"],
  )
  assert.equal(await balance(simultaneous), 14)

  await createEvent(9, 0)
  assert.deepEqual(await claim(9, simultaneous), {
    status: "claimed",
    pointsAwarded: 0,
    pointsBalance: 14,
  })
  assert.deepEqual(await attendance(9, simultaneous), [{ points_awarded: 0 }])

  const maxed = await createMember({
    email: "maxed@utoronto.ca",
    points: 2147483647,
  })
  assert.equal((await claim(5, maxed)).status, "points_unavailable")
  assert.equal((await attendance(5, maxed)).length, 0)

  const rollbackMember = await createMember({ email: "rollback@utoronto.ca" })
  await createEvent(7, 2)
  await query(`
    create function public.reject_points() returns trigger language plpgsql as $$
    begin raise exception 'simulated balance failure'; end; $$;
    create trigger reject_points before update of points on public.member_profiles
    for each row execute function public.reject_points();
  `)
  await assert.rejects(claim(7, rollbackMember), /simulated balance failure/)
  assert.equal((await attendance(7, rollbackMember)).length, 0)
  assert.equal(await balance(rollbackMember), 0)
  await query("drop trigger reject_points on public.member_profiles")
  await query("drop function public.reject_points()")

  console.log(
    "Attendance SQL integration checks passed (permissions, validation, concurrency, balances, rollback).",
  )
} finally {
  await pool.end()
}
