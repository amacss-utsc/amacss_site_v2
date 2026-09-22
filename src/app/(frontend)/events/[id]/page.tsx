import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import RichText from "@/components/RichText"
import { FetchEventById } from "@/app/(frontend)/_data"
import type { EventTag } from "@/payload-types"
import { EVENT_REGISTRATION_OPEN } from "@/utilities/auth"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const { event } = await FetchEventById(id)

  if (!event) return {}

  return {
    title: event.title,
    description: event.previewText,
  }
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params

  const { event } = await FetchEventById(id)

  if (!event) notFound()

  const image = typeof event.image !== "number" ? event.image : null
  const tags = event.eventTag.filter(
    (tag): tag is EventTag => typeof tag !== "number",
  )

  const date = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Toronto",
  })
  const time = [event.startTime, event.endTime].filter(Boolean).join(" - ")

  const registrationHref =
    event.regStyle === "internal"
      ? `/register/event/${event.id}`
      : event.regStyle === "external" && event.registrationLink
        ? event.registrationLink
        : null

  return (
    <main className="min-h-full h-full overflow-y-auto bg-gray-90 text-gray-02 px-7 py-12 lg:px-20 lg:rounded-tl-[32px]">
      <Link
        href="/events"
        className="inline-block mb-6 text-gray-10 font-bold uppercase hover:text-blue-30 transition-colors"
      >
        ← Back to Events
      </Link>

      <article className="max-w-4xl">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt ?? event.title}
            width={image.width ?? 1200}
            height={image.height ?? 630}
            className="w-full max-h-[480px] object-cover rounded-[32px] bg-white mb-8"
            priority
          />
        )}

        <h1 className="text-4xl lg:text-5xl font-black uppercase">
          {event.title}
        </h1>
        <div className="w-full h-[3px] bg-gray-02 my-4" />
        <h2 className="text-xl font-bold uppercase text-gray-10">
          {date}
          {time && ` @ ${time}`}
        </h2>

        {tags.length > 0 && (
          <div className="flex flex-row flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-[8px] border-[2px] border-gray-05 p-1.5 bg-gray-02 text-black text-xs font-semibold text-opacity-40"
              >
                {tag.eventTag}
              </span>
            ))}
          </div>
        )}

        <RichText
          content={event.description}
          enableProse
          enableGutter={false}
          className="w-full px-0 mt-8 prose-invert"
        />

        {registrationHref &&
          (EVENT_REGISTRATION_OPEN ? (
            <Link
              href={registrationHref}
              {...(event.regStyle === "external" && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="block mt-10 bg-blue-30 hover:bg-blue-40 py-4 w-full rounded-[48px] text-white text-center font-black text-3xl uppercase transition-colors"
            >
              Register Now
            </Link>
          ) : (
            <p className="mt-10 py-4 w-full rounded-[48px] bg-gray-80 text-gray-10 text-center font-bold text-xl normal-case">
              Registration opening soon. Email verification will be required
              before registering for an event.
            </p>
          ))}
      </article>
    </main>
  )
}
