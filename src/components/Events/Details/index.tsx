import RichText from "@/components/RichText"
import type { Event } from "@/payload-types"
import { cn } from "@/utilities/cn"
import Image from "next/image"
import type { FC } from "react"
import { EventRegisterButton } from "./RegisterButton"
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

export const EventDetails: FC<{ event: Event }> = ({ event }) => {
  const image = getEventImage(event)

  return (
    <article className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white">
      {image && (
        <Image
          src={image.url}
          alt={image.alt || event.title}
          width={image.width}
          height={image.height}
          priority
          className="w-full max-h-[520px] object-cover bg-white"
        />
      )}
      <div className="px-5 pt-4 pb-6 lg:px-8">
        <h1 className="text-gray-90 font-bold uppercase text-4xl">
          {event.title}
        </h1>
        <div className="w-full h-[3px] bg-gray-90 my-2" />
        <EventDate event={event} format="long" className="mb-2" />
        <EventTags event={event} className="mb-4" />
        <EventDescription event={event} />
        <EventRegisterButton event={event} className="mt-8" />
      </div>
    </article>
  )
}
