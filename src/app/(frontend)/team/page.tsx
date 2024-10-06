import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from '@payload-config'
import React from "react"
import { SubTeam, TeamMember } from "@/payload-types";

export default async function Team() {
    const payload = await getPayloadHMR({ config: configPromise })

    const latestTeam = await payload.find({
    collection: 'teams',
    limit: 1,
    sort: '-year',
  });

    if (!latestTeam.docs.length) {
        return <div>No team found</div>
    }

  const { name, nameWithYear, year, "sub-teams": subTeams } = latestTeam.docs[0]
    
    return (
        <div>
            <h1>{nameWithYear}</h1>
            <h2>{year}</h2>
            <ul>
                {subTeams && subTeams
                    .filter((subTeam): subTeam is SubTeam => typeof subTeam !== 'number')
                    .map(({ name, "team-members": teamMembers }) => (
                        <li key={name}>
            <h3>{name}</h3>
            <ul>
              {teamMembers && teamMembers.filter((teamMember): teamMember is TeamMember => typeof teamMember !== 'number').map(({id, name}) => (
                <div key={id}>
                    <p>{name}</p>
                </div>
              ))}
            </ul>
          </li>
                    ))}
            </ul>
        </div>
    )
}