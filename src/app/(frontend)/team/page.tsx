import React from "react"
import { ErrDefault, FetchTeam } from "../_data"
import { SubTeam } from "@/payload-types"
import { TeamPageClient } from "@/components/Team/Page"

export default async function Page() {
  const { team, error } = await FetchTeam()

  const subteams: SubTeam[] = ErrDefault(error, team?.["sub-teams"], [])

  return <TeamPageClient subteams={subteams} />
}
