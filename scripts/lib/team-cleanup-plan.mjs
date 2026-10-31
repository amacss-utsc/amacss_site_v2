export function referencedMedia(value, photos, protectedIds) {
  if (typeof value === "string") {
    for (const photo of photos) {
      if (
        photo.filename &&
        [photo.filename, encodeURIComponent(photo.filename)].some((name) =>
          value.includes(name),
        )
      ) {
        protectedIds.add(photo.id)
      }
    }
  } else if (Array.isArray(value)) {
    value.forEach((item) => referencedMedia(item, photos, protectedIds))
  } else if (value && typeof value === "object") {
    if (value.relationTo === "media") {
      const id = typeof value.value === "object" ? value.value?.id : value.value
      if (id != null) protectedIds.add(Number(id))
    }
    Object.values(value).forEach((item) =>
      referencedMedia(item, photos, protectedIds),
    )
  }
}

export function buildTeamCleanupPlan(snapshot, currentTeam, protectedIds) {
  const retainedTeams = new Set(
    snapshot.teams
      .filter((t) => t.is_current || String(t.id) === currentTeam.id)
      .map((t) => t.id),
  )
  const retainedSubteams = new Set(
    currentTeam.departments.map((d) => Number(d.id)),
  )
  snapshot.teams_rels
    .filter((r) => retainedTeams.has(r.parent_id))
    .forEach((r) => retainedSubteams.add(r.sub_teams_id))
  const retainedMembers = new Set(
    currentTeam.departments
      .flatMap((d) => [...d.priorityMembers, ...d.members])
      .map((m) => Number(m.id)),
  )
  const memberLinks = [
    ...snapshot.sub_teams_prio_team_members,
    ...snapshot.sub_teams_team_members,
  ]
  memberLinks
    .filter((r) => retainedSubteams.has(r._parent_id))
    .forEach((r) => retainedMembers.add(r.member_id))
  snapshot.team_members
    .filter((m) => m.membership_year === currentTeam.year)
    .forEach((m) => retainedMembers.add(m.id))
  const retainedTypes = new Set(
    snapshot.sub_teams
      .filter((s) => retainedSubteams.has(s.id))
      .map((s) => s.type_id),
  )
  const remove = {
    teams: snapshot.teams.filter((t) => !retainedTeams.has(t.id)),
    sub_teams: snapshot.sub_teams.filter((s) => !retainedSubteams.has(s.id)),
    team_members: snapshot.team_members.filter(
      (m) => !retainedMembers.has(m.id),
    ),
    sub_team_types: snapshot.sub_team_types.filter(
      (t) => !retainedTypes.has(t.id),
    ),
  }
  const ids = Object.fromEntries(
    Object.entries(remove).map(([table, rows]) => [
      table,
      new Set(rows.map((r) => r.id)),
    ]),
  )
  remove.teams_rels = snapshot.teams_rels.filter((r) =>
    ids.teams.has(r.parent_id),
  )
  remove.sub_teams_prio_team_members =
    snapshot.sub_teams_prio_team_members.filter((r) =>
      ids.sub_teams.has(r._parent_id),
    )
  remove.sub_teams_team_members = snapshot.sub_teams_team_members.filter((r) =>
    ids.sub_teams.has(r._parent_id),
  )

  const photoIds = new Set(remove.team_members.map((m) => m.photo_id))
  snapshot.team_members
    .filter((m) => retainedMembers.has(m.id))
    .forEach((m) => protectedIds.add(m.photo_id))
  remove.media = snapshot.media.filter(
    (m) => photoIds.has(m.id) && !protectedIds.has(m.id),
  )
  ids.media = new Set(remove.media.map((m) => m.id))

  const lockColumns = {
    teams_id: "teams",
    sub_teams_id: "sub_teams",
    team_members_id: "team_members",
    sub_team_types_id: "sub_team_types",
    media_id: "media",
  }
  remove.payload_locked_documents_rels =
    snapshot.payload_locked_documents_rels.filter((r) =>
      Object.entries(lockColumns).some(([column, table]) =>
        ids[table].has(r[column]),
      ),
    )
  const removedLockRefs = new Set(
    remove.payload_locked_documents_rels.map((r) => r.id),
  )
  const affectedLocks = new Set(
    remove.payload_locked_documents_rels.map((r) => r.parent_id),
  )
  remove.payload_locked_documents = snapshot.payload_locked_documents.filter(
    (r) =>
      affectedLocks.has(r.id) &&
      snapshot.payload_locked_documents_rels
        .filter((rel) => rel.parent_id === r.id)
        .every((rel) => removedLockRefs.has(rel.id)),
  )
  return remove
}
