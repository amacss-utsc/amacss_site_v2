import React from "react"
import { team } from "@/data/team"
import { TeamPageClient } from "@/components/Team/Page"

export default function Page() {
  return <TeamPageClient subteams={team.departments} />
}
