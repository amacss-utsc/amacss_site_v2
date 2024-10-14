import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'

export async function Header() {
  const header: Header = await getCachedGlobal('header', 1)()
  const { user } = await getMeUser()

  return <HeaderClient header={header} user={user} />
}
