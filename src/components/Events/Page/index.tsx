"use client"
import Filter from "@/components/svg/Filter"
import { Event, Media } from "@/payload-types"
import { PaginatedDocs } from "payload"
import { FC, useEffect, useState } from "react"
import Image from "next/image"
import InfoI from "@/components/svg/InfoI"
import { cn } from "@/utilities/cn"
import { RibbonStyle } from "@/utilities/tailwindShared"
import { useStateContext } from "@/providers/State"

type EventsPageProps = {
  events: PaginatedDocs<Event>
  tags: string[]
}

export const EventsPage: FC<EventsPageProps> = ({ events, tags }) => {
  const [e, sE] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

  const {
    setFocusedEvent,
    setFilterOpen,
    tags: cTags,
    setTags,
    tagsIndices,
    startDate,
    endDate,
  } = useStateContext()

  useEffect(() => {
    if (tags !== cTags) setTags(tags)
  }, [tags])

  useEffect(() => {
    if (events?.docs !== e) sE(events?.docs ?? [])
  }, [events])

  useEffect(() => {
    const filtered = e.filter((event) => {
      const eventDate = new Date(event.date)
      const dF =
        (!startDate && !endDate) ||
        (startDate && !endDate && eventDate >= startDate) ||
        (!startDate && endDate && eventDate <= endDate) ||
        (startDate && endDate && eventDate >= startDate && eventDate <= endDate)

      const eT = event.eventTag.map((tag) =>
        typeof tag !== "number" ? tag.eventTag : null,
      )

      const tF =
        tagsIndices.length === 0 ||
        tagsIndices.some((index) => tags[index] && eT.includes(tags[index]))

      return dF && tF
    })

    setFilteredEvents(filtered)
  }, [e, tagsIndices, startDate, endDate, tags])

  return (
    <main className="pt-16 px-8 lg:p-11 bg-gray-90 h-full lg:rounded-tl-[32px] overflow-x-hidden">
      <button
        onClick={() => setFilterOpen(true)}
        className="text-gray-10 font-semibold text-2xl uppercase flex items-center justify-center mt-7 mb-3 lg:hidden"
      >
        <Filter className="inline mr-1" />
        Filters
      </button>

      <section className="lg:grid lg:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] lg:gap-10 overflow-y-scroll">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-02 mt-10">No events to show :(</p>
        ) : (
          filteredEvents.map((ev, j) => {
            const img: Media | null =
              typeof ev.image !== "number" &&
              ev.image != null &&
              "url" in ev.image &&
              ev.image.url
                ? ev.image
                : null

            if (img === null) return null

            const { url, alt, width, height } = img

            if (!url || !alt || width == null || height == null) return null

            const rT =
              typeof ev.ribbonTag !== "number" && ev.ribbonTag?.ribbonTag
                ? ev.ribbonTag?.ribbonTag
                : ""
            return (
              <article
                key={j}
                className="w-full h-[412px] bg-white rounded-b-[12px] flex flex-col relative overflow-hidden mb-11 max-w-[400px] lg:mb-6"
              >
                <div
                  className={cn(
                    RibbonStyle,
                    rT === "" ? "bg-white opacity-20" : "bg-blue-20",
                    "top-[18px] h-[33px] left-[36px]",
                  )}
                >
                  {rT}
                </div>
                <div
                  className={cn(
                    RibbonStyle,
                    "bg-white opacity-20 h-[33px] top-[40.5px] left-[81px] w-[300px]",
                  )}
                >
                  {" "}
                </div>
                <div>

                <Image
                  src={url}
                  alt={alt}
                  width={width}
                  height={height}
                  className="w-full h-[300px] object-cover"
                />
                </div>
                <div className="flex flex-col h-full px-2.5 py-1.5">
                  <h2 className="font-bold text-2xl text-gray-90">
                    {ev.title}
                  </h2>
                  <p className="text-[12px] ">{ev.previewText}</p>
                  <div className="w-full flex items-end justify-between mt-auto uppercase ">
                    <p className="text-gray-30 text-sm font-semibold">
                      {new Date(ev.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }) ?? ""}
                    </p>
                    <button
                      className="text-blue-20 text-sm font-semibold flex items-center uppercase"
                      onClick={() => setFocusedEvent(ev)}
                    >
                      Learn more
                      <InfoI className="inline ml-[3px]" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </section>
    </main>
  )
}
