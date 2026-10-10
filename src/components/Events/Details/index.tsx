import RichText from "@/components/RichText"
import type { Event } from "@/payload-types"
import { cn } from "@/utilities/cn"
import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"
import { getEventImage, getEventTags } from "./utils"

export { EventRegisterButton } from "./RegisterButton"
export * from "./utils"

// Pinned so server and client renders agree on the calendar day.
const EVENT_TIME_ZONE = "America/Toronto"

type EventDateProps = {
  event: Event
  format?: "short" | "long"
  className?: string
}

export const EventDate: FC<EventDateProps> = ({
  event,
  format = "short",
  className,
}) => {
  const date = new Date(event.date).toLocaleDateString(
    "en-US",
    format === "long"
      ? {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: EVENT_TIME_ZONE,
        }
      : { month: "short", day: "numeric", timeZone: EVENT_TIME_ZONE },
  )
  const time = [event.startTime, event.endTime].filter(Boolean).join(" - ")

  return (
    <h2 className={cn("text-gray-90 font-bold uppercase", className)}>
      {date}
      {time && ` @ ${time}`}
    </h2>
  )
}

export const EventTags: FC<{ event: Event; className?: string }> = ({
  event,
  className,
}) => {
  const tags = getEventTags(event)
  if (tags.length === 0) return null

  return (
    <div className={cn("w-full flex flex-row flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="rounded-[8px] border-[2px] border-gray-05 p-1.5 bg-gray-02 text-black text-xs font-semibold text-opacity-40"
        >
          {tag.eventTag}
        </span>
      ))}
    </div>
  )
}

export const EventDescription: FC<{ event: Event; className?: string }> = ({
  event,
  className,
}) => (
  <RichText
    content={event.description}
    enableProse
    enableGutter
    className={cn("w-full px-0 text-black [&_*]:text-black", className)}
  />
)

type EventHost = { name: string; color: string; primary?: boolean }

const EVENT_HOSTS: EventHost[] = [
  { name: "AMACSS", color: "bg-blue-30", primary: true },
]

const dayKey = (value: string) =>
  new Date(value).toLocaleDateString("en-CA", { timeZone: EVENT_TIME_ZONE })

const isMultiDay = (event: Event) =>
  Boolean(event.endDate) && dayKey(event.endDate!) !== dayKey(event.date)

const formatSchedule = (event: Event) => {
  const format = (value: string, options: Intl.DateTimeFormatOptions) =>
    new Date(value).toLocaleDateString("en-US", {
      ...options,
      timeZone: EVENT_TIME_ZONE,
    })

  const date = isMultiDay(event)
    ? `${format(event.date, { month: "short", day: "numeric" })} – ${format(
        event.endDate!,
        { month: "short", day: "numeric", year: "numeric" },
      )}`
    : format(event.date, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
  const time = [event.startTime, event.endTime].filter(Boolean).join(" – ")

  return [date, time].filter(Boolean).join(" · ")
}

const EventMeta: FC<{ event: Event }> = ({ event }) => {
  const ribbon =
    typeof event.ribbonTag === "object" ? event.ribbonTag?.ribbonTag : null
  const items = [
    getEventTags(event)
      .map((tag) => tag.eventTag)
      .join(", "),
    isMultiDay(event) ? "Multi-day event" : "One-time event",
    event.points > 0 ? `${event.points} points` : null,
  ].filter(Boolean)

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-gray-30">
      {ribbon && (
        <span className="rounded-full border border-gray-90/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-60 shadow-sm">
          {ribbon}
        </span>
      )}
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && (
            <span aria-hidden className="h-1 w-1 rounded-full bg-gray-10" />
          )}
          {item}
        </span>
      ))}
    </div>
  )
}

const EventHosts: FC = () => (
  <section>
    <h2 className="text-lg font-bold text-gray-90">Event Host</h2>
    <ul className="mt-4 flex flex-col gap-4">
      {EVENT_HOSTS.map((host) => (
        <li key={host.name} className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-white",
              host.color,
            )}
          >
            {host.name.charAt(0)}
          </span>
          <span className="font-semibold text-gray-90">{host.name}</span>
          {host.primary && (
            <span className="rounded-full border border-gray-90/10 px-2 py-0.5 text-xs font-medium text-gray-30">
              Host
            </span>
          )}
        </li>
      ))}
    </ul>
  </section>
)

export const EventDetails: FC<{ event: Event }> = ({ event }) => {
  const image = getEventImage(event)

  return (
    <article className="relative isolate">
      {image && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[620px] overflow-hidden lg:h-[680px]"
        >
          <Image
            src={image.url}
            alt=""
            fill
            sizes="100vw"
            className="scale-125 object-cover opacity-60 blur-3xl saturate-150"
          />
          <div className="absolute inset-0 bg-[#FAFAF8]/40" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-[#FAFAF8]" />
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-24 sm:px-8 lg:px-12 lg:pt-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-90 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.25)] ring-1 ring-gray-90/5 transition hover:-translate-y-px hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]"
        >
          <span aria-hidden>←</span>
          Back
        </Link>

        <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          {image && (
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-24px_rgba(0,0,0,0.35)] ring-1 ring-gray-90/5">
                <Image
                  src={image.url}
                  alt={image.alt || event.title}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority
                  className="max-h-[640px] w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-10 lg:pt-6">
            <header className="flex flex-col gap-5">
              <p className="text-sm font-medium text-gray-30">
                {formatSchedule(event)}
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-90 sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>
              <EventMeta event={event} />
              {event.previewText?.trim() && (
                <p className="max-w-xl text-lg leading-relaxed text-gray-40">
                  {event.previewText}
                </p>
              )}
            </header>

            <EventHosts />

            <section className="border-t border-gray-90/10 pt-10">
              <h2 className="text-lg font-bold text-gray-90">
                About this event
              </h2>
              <EventDescription
                event={event}
                className="mt-4 max-w-none text-gray-50 [&_*]:text-gray-50"
              />
            </section>
          </div>
        </div>
      </div>
    </article>
  )
}
