import { ResourcesPage } from '@/components/Resources/Page'
import { ErrDefault, FetchResources, FetchResourceTags } from '../_data'

export default async function Page() {
  const { resources, error: resError } = await FetchResources({ limit: 100 })
  const r = ErrDefault(resError, resources?.docs, [])

  const { tags, error: tagError } = await FetchResourceTags()
  const t = ErrDefault(tagError, tags, [])

  return <ResourcesPage resources={r} tags={t} />
}