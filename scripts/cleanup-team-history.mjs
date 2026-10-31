// Requires Node 20.12+ and the project's installed dependencies.
// Dry run: node --env-file=.env scripts/cleanup-team-history.mjs
// Apply:   node --env-file=.env scripts/cleanup-team-history.mjs --apply
// Resume files: node --env-file=.env scripts/cleanup-team-history.mjs --resume /path/to/plan.json --apply
import { createClient } from "@supabase/supabase-js"
import ts from "typescript"
import { readFile, writeFile, mkdir, stat, rename } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { finishStorageCleanup } from "./lib/team-cleanup-storage.mjs"
import {
  buildTeamCleanupPlan,
  referencedMedia,
} from "./lib/team-cleanup-plan.mjs"

let apply = false
let resumePath = null
const args = process.argv.slice(2)
for (let index = 0; index < args.length; index++) {
  if (args[index] === "--apply") apply = true
  else if (
    args[index] === "--resume" &&
    args[index + 1] &&
    !args[index + 1].startsWith("--")
  )
    resumePath = resolve(args[++index])
  else
    throw new Error(
      "Usage: cleanup-team-history.mjs [--apply] [--resume /path/to/plan.json]",
    )
}
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY
const bucket = process.env.S3_BUCKET
if (!url || !key || !bucket)
  throw new Error("SUPABASE_URL, server key, and S3_BUCKET are required")
const admin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const check = ({ data, error }, context) => {
  if (error) throw new Error(`${context}: ${error.message}`)
  return data
}

async function allRows(table, fields = "*") {
  const rows = []
  for (let offset = 0; ; offset += 1000) {
    const page = check(
      await admin
        .from(table)
        .select(fields)
        .order("id")
        .range(offset, offset + 999),
      table,
    )
    rows.push(...page)
    if (page.length < 1000) return rows
  }
}

async function readProgress(directory) {
  try {
    return JSON.parse(
      await readFile(`${directory}/storage-progress.json`, "utf8"),
    ).completedFiles
  } catch (error) {
    if (error.code === "ENOENT") return []
    throw error
  }
}

async function finishFiles(directory, files) {
  return finishStorageCleanup({
    storage: admin.storage.from(bucket),
    files,
    completedFiles: await readProgress(directory),
    saveProgress: async (completedFiles) => {
      const file = `${directory}/storage-progress.json`
      await writeFile(
        `${file}.tmp`,
        JSON.stringify(
          { completedFiles, updatedAt: new Date().toISOString() },
          null,
          2,
        ),
        { mode: 0o600 },
      )
      await rename(`${file}.tmp`, file)
    },
    beforeDelete: async (batch) => {
      // A restored/recreated media record may now own one of these filenames.
      const restored = check(
        await admin.from("media").select("id").in("filename", batch),
        "Check restored media",
      )
      if (restored.length)
        throw new Error(
          "Pending files have media records again; review before deleting",
        )
    },
  })
}

if (resumePath) {
  // This path intentionally never reads teams or team_members. Those rows may
  // already have been deleted by the original run.
  const saved = JSON.parse(await readFile(resumePath, "utf8"))
  if (saved.summary?.host !== new URL(url).hostname || saved.bucket !== bucket)
    throw new Error(
      "Manifest project/bucket does not match the configured Supabase project",
    )
  if (
    !Array.isArray(saved.files) ||
    !Array.isArray(saved.rows?.media) ||
    saved.files.some(
      (file) => typeof file !== "string" || !file || file.includes("/"),
    )
  )
    throw new Error("Invalid storage cleanup manifest")
  const completed = new Set(await readProgress(dirname(resumePath)))
  const pending = saved.files.filter((file) => !completed.has(file))
  const photos = saved.rows.media.filter((photo) =>
    pending.includes(photo.filename),
  )
  if (
    new Set(photos.map((photo) => photo.filename)).size !==
    new Set(pending).size
  )
    throw new Error("Manifest is missing metadata for pending files")
  const protectedIds = new Set()
  const currentMedia = await allRows("media", "id,filename")
  photos.forEach((photo) => {
    if (
      currentMedia.some(
        (row) => row.id === photo.id || row.filename === photo.filename,
      )
    )
      protectedIds.add(photo.id)
  })
  for (const [table, fields] of [
    ["events", "id,description,preview_text,registration_link"],
    ["resources", "id,description,link"],
    ["registrations_answers", "id,answer"],
    ["events_registration_form", "id,description"],
  ])
    referencedMedia(await allRows(table, fields), photos, protectedIds)
  const live = await fetch("https://www.amacss.org/team", { cache: "no-store" })
  if (!live.ok)
    throw new Error(`Cannot verify live dependencies: HTTP ${live.status}`)
  referencedMedia(await live.text(), photos, protectedIds)
  referencedMedia(
    await readFile("src/data/team.ts", "utf8"),
    photos,
    protectedIds,
  )
  if (protectedIds.size)
    throw new Error(
      "Pending files are referenced again; review before resuming",
    )
  console.log(
    JSON.stringify(
      { resume: resumePath, pendingFiles: pending.length, applied: apply },
      null,
      2,
    ),
  )
  if (apply) {
    const finished = await finishFiles(dirname(resumePath), saved.files)
    console.log(JSON.stringify({ completedFiles: finished.length }, null, 2))
  }
  process.exit(0)
}

const source = await readFile("src/data/team.ts", "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const loadedModule = { exports: {} }
new Function("module", "exports", compiled)(loadedModule, loadedModule.exports)
const currentTeam = loadedModule.exports.team
const localMembers = [
  ...new Map(
    currentTeam.departments
      .flatMap((d) => [...d.priorityMembers, ...d.members])
      .map((m) => [m.id, m]),
  ).values(),
]
for (const member of localMembers) {
  if (!member.photo.src.startsWith("/static/images/team/"))
    throw new Error("Current roster must use local photos")
  const file = await stat(resolve("public", `.${member.photo.src}`))
  if (!file.isFile() || !file.size)
    throw new Error(`Missing local photo for member ${member.id}`)
}

const schemaResponse = await fetch(`${url}/rest/v1/`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
})
if (!schemaResponse.ok)
  throw new Error(`Schema request failed: ${schemaResponse.status}`)
const { definitions } = await schemaResponse.json()
const teamTables = [
  "teams",
  "teams_rels",
  "sub_teams",
  "sub_teams_prio_team_members",
  "sub_teams_team_members",
  "sub_team_types",
  "team_members",
]
const snapshot = Object.fromEntries(
  await Promise.all(
    [
      ...teamTables,
      "media",
      "payload_locked_documents",
      "payload_locked_documents_rels",
    ].map(async (table) => [table, await allRows(table)]),
  ),
)
if (
  !snapshot.teams.some((t) => String(t.id) === currentTeam.id && t.is_current)
)
  throw new Error(
    "Current team does not match the database; review before cleanup",
  )

const protectedIds = new Set()
const teamMedia = snapshot.media.filter((m) =>
  snapshot.team_members.some((member) => member.photo_id === m.id),
)
for (const [table, definition] of Object.entries(definitions)) {
  for (const [column, field] of Object.entries(definition.properties || {})) {
    const target = /<fk table='([^']+)'/.exec(field.description || "")?.[1]
    if (
      teamTables.includes(target) &&
      !teamTables.includes(table) &&
      table !== "payload_locked_documents_rels"
    ) {
      throw new Error(
        `Unexpected team dependency ${table}.${column}; review before cleanup`,
      )
    }
    if (
      target !== "media" ||
      table === "team_members" ||
      table === "payload_locked_documents_rels"
    )
      continue
    const rows = await allRows(table, `id,${column}`)
    rows.forEach((row) => protectedIds.add(row[column]))
  }
}

// Also protect filenames/URLs and rich-text uploads that do not have SQL FKs.
for (const [table, fields] of [
  ["events", "id,description,preview_text,registration_link"],
  ["resources", "id,description,link"],
  ["registrations_answers", "id,answer"],
  ["events_registration_form", "id,description"],
]) {
  referencedMedia(await allRows(table, fields), teamMedia, protectedIds)
}
const liveResponse = await fetch("https://www.amacss.org/team", {
  cache: "no-store",
})
if (!liveResponse.ok)
  throw new Error(
    `Cannot verify live dependencies: HTTP ${liveResponse.status}`,
  )
const liveHtml = await liveResponse.text()
referencedMedia(liveHtml, teamMedia, protectedIds)
referencedMedia(source, teamMedia, protectedIds)
const plan = buildTeamCleanupPlan(snapshot, currentTeam, protectedIds)

const storageObjects = []
for (let offset = 0; ; offset += 1000) {
  const rows = check(
    await admin.storage.from(bucket).list("", {
      limit: 1000,
      offset,
      sortBy: { column: "name", order: "asc" },
    }),
    "Storage listing",
  )
  storageObjects.push(...rows.filter((row) => row.id))
  if (rows.length < 1000) break
}
if (plan.media.some((m) => !m.filename || m.filename.includes("/")))
  throw new Error("Unexpected media path; review before cleanup")
const files = storageObjects
  .filter((object) => plan.media.some((m) => m.filename === object.name))
  .map((object) => object.name)
const summary = {
  host: new URL(url).hostname,
  currentYear: currentTeam.year,
  localMembers: localMembers.length,
  deleteRows: Object.fromEntries(
    Object.entries(plan).map(([table, rows]) => [table, rows.length]),
  ),
  deleteStorageFiles: files.length,
  deletePhotoBytes: plan.media.reduce(
    (total, photo) => total + (photo.filesize || 0),
    0,
  ),
  remainingTeams: snapshot.teams.length - plan.teams.length,
  remainingMembers: snapshot.team_members.length - plan.team_members.length,
  applied: apply,
}
console.log(JSON.stringify(summary, null, 2))
if (!apply) process.exit(0)

const backupDir = `/tmp/amacss-team-cleanup-${new Date().toISOString().replace(/[:.]/g, "-")}`
await mkdir(backupDir, { mode: 0o700 })
await writeFile(
  `${backupDir}/plan.json`,
  JSON.stringify({ summary, rows: plan, bucket, files }, null, 2),
  { mode: 0o600 },
)
console.log(`Cleanup metadata backup: ${backupDir}/plan.json`)

// Remove only audited IDs; never truncate tables or touch member accounts.
// Child rows precede parent rows. Media is removed only after historical members.
const order = [
  "payload_locked_documents_rels",
  "payload_locked_documents",
  "teams_rels",
  "sub_teams_prio_team_members",
  "sub_teams_team_members",
  "teams",
  "sub_teams",
  "team_members",
  "sub_team_types",
  "media",
]
const completed = {}
for (const table of order) {
  const ids = plan[table].map((row) => row.id)
  let deleted = 0
  for (let offset = 0; offset < ids.length; offset += 50) {
    const rows = check(
      await admin
        .from(table)
        .delete()
        .in("id", ids.slice(offset, offset + 50))
        .select("id"),
      `Delete ${table}`,
    )
    deleted += rows.length
  }
  completed[table] = deleted
  await writeFile(
    `${backupDir}/completed.json`,
    JSON.stringify(completed, null, 2),
    { mode: 0o600 },
  )
}
await finishFiles(backupDir, files)
console.log(
  JSON.stringify(
    { deletedRows: completed, deletedStorageFiles: files.length },
    null,
    2,
  ),
)
// Reread the live page so accidental dependency changes cannot go unnoticed.
const after = await fetch("https://www.amacss.org/team", { cache: "no-store" })
const afterHtml = await after.text()
const deletedPhotoReferences = new Set()
referencedMedia(afterHtml, plan.media, deletedPhotoReferences)
if (!after.ok || deletedPhotoReferences.size)
  throw new Error("Live team page verification failed after cleanup")
console.log(
  "Live team page verified; current Payload team data and local photos preserved.",
)
