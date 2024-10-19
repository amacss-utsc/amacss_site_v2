import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'

import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from '@payload-config'


export async function Header() {
  const header: Header = await getCachedGlobal('header', 1)()
  const { user } = await getMeUser()
  const payload = await getPayloadHMR({ config: configPromise })

  /**
   * Fetching the icons from the database to reduce the number of requests
   * and assuming the icons are already in the database
   */
  const { docs } = await payload.find({
    collection: 'media',
    where: {
      or: [
        {
          alt: {
            equals: 'user-icon'
          },
        },
        {
          alt: {
            equals: 'hamburger-icon'
          }
        },
        {
            alt: {
              equals: 'right-arrowhead-icon'
            }
          }
      ]
    }
  })

  // console.log(docs)

  return <HeaderClient header={header} user={user} icons={docs}/>
}
