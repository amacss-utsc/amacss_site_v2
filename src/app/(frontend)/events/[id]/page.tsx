import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { EventDetails, getEventImage } from "@/components/Events/Details"
import { FetchEventById } from "@/app/(frontend)/_data"
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

const getEvent = cache(FetchEventById)

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const { event } = await getEvent(id)

  if (!event) return { title: "Event not found" }

  const image = getEventImage(event)
  const url = `/events/${event.id}`
  const description = event.previewText?.trim()
  const descriptionMeta = description ? { description } : {}

  return {
    title: event.title,
    ...descriptionMeta,
    alternates: { canonical: url },
    openGraph: mergeOpenGraph({
      title: event.title,
      ...descriptionMeta,
      url,
      images: image
        ? [
            {
              url: image.url,
              width: image.width,
              height: image.height,
              alt: image.alt || event.title,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: "summary_large_image",
      title: event.title,
      ...descriptionMeta,
      images: image ? [image.url] : undefined,
    },
  }
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  const { event } = await getEvent(id)

  if (!event) notFound()

  return (
    <main className="min-h-full overflow-clip bg-[#FAFAF8] text-gray-90 lg:rounded-tl-[32px]">
      <EventDetails event={event} />
    </main>
  )
}
