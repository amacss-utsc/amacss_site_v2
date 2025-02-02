import { EventsPage } from '@/components/Events/Page'
import React from 'react'
import { ErrDefault, FetchEvents, FetchEventTags } from '../_data'

export default async function Page() {

  const { events, error } = await FetchEvents({limit: 40})

  const e = ErrDefault(error, events, [])

  const { tags, error: et } = await FetchEventTags()

  const t = ErrDefault(et, tags, [])

  return (
    <EventsPage events={e} tags={t} />
  )
}

