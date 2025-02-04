"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { Links } from "../Nav"
import Logo from "../svg/Logo"
import { colors } from "@/utilities/colors"
import { PaginatedDocs } from "payload"
import { useStateContext } from "@/providers/State"
import { Event, Media } from "@/payload-types"
import { cn } from "@/utilities/cn"
import { NavLink, RibbonStyle } from "@/utilities/tailwindShared"
import Linkificator from "../svg/Linkificator"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import "@splidejs/splide/dist/css/splide.min.css"
import Collapsible from "../Collapsible"
import Check from "../svg/Check"
import { DatePicker } from "../ui/datepicker"
import Login from "../svg/Login"
import { useAuth } from "@/providers/Auth"
import User from "../svg/User"
import { CompactEventImageWithLoader } from "../Events/ImageLoader"

type Props = {
  events: PaginatedDocs<Event>
  tags: string[]
}

export const DesktopSidebar: FC<Props> = ({ events, tags }) => {
  const [e, sE] = useState<Event[]>([])
  const pathname = usePathname()

  const {
    setFocusedEvent,
    tags: cTags,
    setTags,
    tagsIndices,
    setTagsIndices,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  } = useStateContext();

  useEffect(() => {
    if (tags !== cTags) setTags(tags)
  }, [tags])

  useEffect(() => {
    if (events?.docs !== e) sE(events?.docs ?? [])
  }, [events])

  if (pathname === "/login" || pathname === "/register") return null


  if (pathname !== "/events")
    return (
      <nav className="min-w-[242px] hidden lg:flex lg:flex-col bg-gray-80 relative">
        <Link href="/">
          <Logo
            fill={colors.gray["02"]}
            width={200}
            height={30.25}
            className="min-h-[31px] mx-auto mt-[18.5px]"
          />
        </Link>

        <div className="flex-1 overflow-hidden relative px-3">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-80 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-gray-80 to-transparent pointer-events-none z-10" />

          {e.length === 0 ? (
            <p className="text-center text-gray-02 w-full mt-10">No events to show :(</p>
          ) : (
            <Splide
              options={{
                type: "loop",
                direction: "ttb",
                height: "100%",
                autoHeight: true,
                autoplay: true,
                interval: 2200,
                pauseOnHover: true,
                arrows: false,
                pagination: false,
                destroy: false,
              }}
              className="ticker"
            >
              {e.map((ev, j) => {
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
                  <SplideSlide key={j}>
                    <article className="w-full max-w-[218px] max-h-[264px] min-h-[264px] bg-white rounded-b-[12px] flex flex-col relative overflow-hidden mb-11 ticker-tile">
                      {rT && (
                          <div
                            className={cn(
                              RibbonStyle,
                              "bg-blue-20 top-[18px] h-[33px] left-[36px]"
                            )}
                          >
                            {rT}
                          </div>
                      )}
                      <CompactEventImageWithLoader
                        src={url}
                        alt={alt}
                        width={width}
                        height={height}
                        className="w-[218px] max-w-[218px] h-[189px] object-cover"
                      />
                      <div className="flex flex-col h-full px-2.5 py-1.5">
                        <h2 className="font-bold text-gray-90">{ev.title}</h2>
                        <p className="text-[8px] line-clamp-1 text-ellipsis">{ev.previewText}</p>
                        <div className="w-full flex items-end justify-between mt-auto uppercase">
                          <p className="text-gray-30 text-[11px] font-semibold">
                            {new Date(ev.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            }) ?? ""}
                          </p>
                          <button
                            className="text-blue-20 text-sm font-semibold flex items-center uppercase"
                            onClick={() => setFocusedEvent(ev)}
                          >
                            Go now
                            <Linkificator className="inline ml-1.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  </SplideSlide>
                )
              })}
            </Splide>
          )}
        </div>
      </nav>
    )
  else return (
    <nav className="min-w-[242px] hidden lg:flex lg:items-center lg:flex-col bg-gray-80 pt-[18.5px]">

      <Link href="/">
        <Logo fill={colors.gray["02"]} width={200} height={30.25} className="min-h-[31px] mb-9" />
      </Link>

      <div
        className="w-full text-gray-10 relative p-6 pt-4 overflow-scroll"
      >
        <h2 className="font-semibold text-gray-02">Filter</h2>
        <div className="bg-gray-02 h-[2px] rounded-[2px] w-full my-3.5" />
        <Collapsible title={"Tags"} className="">
          {tags.map((i, j) => {
            return (
              <div
                key={j}
                className="flex items-center space-x-2"
                onClick={(e) => {
                  e.stopPropagation()
                  if (tagsIndices.includes(j))
                    setTagsIndices(tagsIndices.filter(tij => tij != j))
                  else
                    setTagsIndices([...tagsIndices, j])

                }}
              >
                <div className={cn(
                  tagsIndices.includes(j) ? "bg-blue-20 border-blue-20" : "border-gray-10",
                  "w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center")}
                >
                  {tagsIndices.includes(j) && <Check />}
                </div>

                <p className={cn("select-none text-lg font-normal normal-case", tagsIndices.includes(j) ? "text-gray-02" : "text-gray-10")}>
                  {i}
                </p>
              </div>
            )
          })}
        </Collapsible>

        <div className="h-7 w-full" />

        <Collapsible title={"Date Range"}>
          <div className="flex flex-col normal-case">
            <label>Start Date</label>
            <DatePicker className="bg-gray-80 hover:bg-gray-80 w-full" fDate={startDate || new Date()} fsetDateAction={setStartDate} />
            <label>End Date</label>
            <DatePicker className="bg-gray-80 hover:bg-gray-80 w-full" fDate={endDate || new Date()} fsetDateAction={setEndDate} />
          </div>
        </Collapsible>

      </div>
    </nav>
  )
}

export const DesktopNav: FC = ({ }) => {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (pathname === "/login" || pathname === "/register") return null

  return (
    <nav className="min-h-[56px] w-full hidden lg:flex justify-between bg-gray-80 pl-9 pr-4">
      <ul className="flex flex-row items-end font-[800] gap-x-11">
        {Links.map((i, j) => (
          <li key={j} className="h-full flex items-center justify-center">
            <Link href={i.u} key={j} className={cn(
                NavLink,
                "relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:rounded-full",
                pathname === i.u 
                  ? "after:bg-white hover:after:bg-gray-20 after:transition-all" 
                  : "after:bg-transparent hover:after:bg-gray-20"
              )}>
              {i.n}
            </Link>
          </li>
        ))}
      </ul>
      {user == null ? (
        <Link
          href={"/login"}
          className={cn(NavLink, "font-bold w-fit uppercase h-full flex items-center justify-center group")}
        >
          <Login className="inline mr-2 transition-colors stroke-[#FFFFFF] group-hover:[stroke:#818488]" />
          Log in
        </Link>
      ) : (
        <div 
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)} 
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            className={cn(NavLink, "font-bold cursor-pointer w-fit uppercase h-full flex items-center justify-center group")}
          >
            <User className="transition-colors inline mr-2 stroke-[#FFFFFF] group-hover:[stroke:#818488]" />
            {user.firstName} {user.lastName}
          </button>
          {dropdownOpen && (
            <div className="absolute bg-gray-80 -mt-2 right-0 shadow-lg rounded-md py-2 w-48 z-10">
              <button
                onClick={() => {
                  logout()
                  setDropdownOpen(false)
                }}
                className={cn(NavLink, "w-full text-left px-4 py-3 rounded-md",
                  "hover:bg-gray-70 transition-colors",
                  "text-gray-10 font-semibold text-sm uppercase",
                  "flex items-center justify-between")}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

