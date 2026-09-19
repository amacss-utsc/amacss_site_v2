"use client"

import RichText from "@/components/RichText"
import ChevronDown from "@/components/svg/ChevronDown"
import Close from "@/components/svg/Close"
import { EventTag } from "@/payload-types"
import { useStateContext } from "@/providers/State"
import { cn } from "@/utilities/cn"
import { EVENT_REGISTRATION_OPEN } from "@/utilities/auth"
import { isRegistrationOpen } from "@/utilities/eventRegistration"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"

export const EventModal = () => {
  const ref = useRef<HTMLDivElement>(null)

  const { focusedEvent, setFocusedEvent } = useStateContext()

  const [scrollProgress, setScrollProgress] = useState(0)
  const [overflowing, setOverflowing] = useState(false)

  const handleScroll = () => {
    const element = ref.current
    if (element) {
      const totalScrollableHeight = element.scrollHeight - element.clientHeight
      const currentScroll = element.scrollTop
      const progress = (currentScroll / totalScrollableHeight) * 100
      setScrollProgress(progress)
    }
  }

  const handleChevronClick = () => {
    const element = ref.current
    if (element) {
      const totalScrollableHeight = element.scrollHeight - element.clientHeight
      const currentScroll = element.scrollTop
      const visibleHeight = element.clientHeight
      const step = visibleHeight * 0.95

      const nS =
        scrollProgress >= 95
          ? Math.max(currentScroll - step, 0)
          : Math.min(currentScroll + step, totalScrollableHeight)

      element.scrollTo({
        top: nS,
        behavior: "smooth",
      })
    }
  }

  const handleRegistrationClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!EVENT_REGISTRATION_OPEN) {
      event.preventDefault()
      toast.custom(
        (notification) => (
          <div
            className={cn(
              "flex max-w-md items-start gap-3 rounded-2xl border border-blue-20/40 bg-gray-80 px-5 py-4 text-gray-02 shadow-2xl transition-all",
              notification.visible
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0",
            )}
          >
            <span
              aria-hidden="true"
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-20"
            />
            <div className="normal-case">
              <p className="font-bold text-white">Registration opening soon</p>
              <p className="mt-1 text-sm font-medium text-gray-10">
                Email verification will be required before registering for an
                event.
              </p>
            </div>
          </div>
        ),
        { duration: 4500, id: "event-registration-paused" },
      )
      return
    }

    setFocusedEvent(null)
  }

  // Only a click that lands on the backdrop itself closes the modal;
  // clicks inside the card bubble up here but carry a different target.
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setFocusedEvent(null)
  }

  useEffect(() => {
    const element = ref.current
    if (element) {
      setOverflowing(element.scrollHeight > element.clientHeight)

      element.addEventListener("scroll", handleScroll)

      return () => {
        element.removeEventListener("scroll", handleScroll)
      }
    }
  }, [ref, focusedEvent])

  useEffect(() => {
    if (focusedEvent === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusedEvent(null)
    }

    document.addEventListener("keydown", onKeyDown)

    return () => document.removeEventListener("keydown", onKeyDown)
  }, [focusedEvent, setFocusedEvent])

  if (focusedEvent === null) return null

  const im = typeof focusedEvent.image !== "number" ? focusedEvent.image : null

  if (im === null) {
    setFocusedEvent(null)
    return null
  }

  const { url, alt, width, height } = im

  if (!url || width == null || height == null) return null

  const eTags =
    typeof focusedEvent?.eventTag !== "number" ? focusedEvent.eventTag : []

  const registrationClosed = !isRegistrationOpen(focusedEvent)

  return (
    <div
      className="w-screen h-screen absolute top-0 left-0 z-50 overflow-hidden lg:w-full lg:h-full lg:flex lg:items-center lg:justify-center lg:bg-gray-90 lg:bg-opacity-60 lg:backdrop-blur"
      onClick={handleBackdropClick}
    >
      <div className="w-screen h-screen flex flex-col lg:w-[833px] lg:h-[545px] relative lg:rounded-[32px] lg:border lg:border-gray-50 overflow-hidden lg:flex-row">
        <Image
          src={url}
          alt={alt ?? ""}
          width={width}
          height={height}
          className="w-full min-h-[40%] max-h-[40%] lg:h-full lg:max-h-full lg:min-h-full lg:min-w-[55%] object-cover bg-gray-70"
        />
        <div className="bg-gray-80 flex-grow px-5 pt-6 overflow-hidden flex flex-col relative lg:w-full ">
          {overflowing && (
            <div
              className={cn(
                focusedEvent.registrationLink ||
                  focusedEvent.regStyle === "internal"
                  ? "bottom-[10px] lg:bottom-[84px]"
                  : "bottom-0",
                "absolute right-0 w-full bg-gradient-to-b from-gray-80/0 to-gray-80 h-[95px] lg:h-[70px] z-10 flex items-center justify-center",
              )}
            >
              <button className="animate-bob" onClick={handleChevronClick}>
                <ChevronDown
                  className={cn(
                    "transition-all",
                    scrollProgress >= 95 && "rotate-180",
                  )}
                />
              </button>
            </div>
          )}
          <hgroup className="flex items-start justify-between w-full gap-4">
            <h1 className="text-white font-bold uppercase text-4xl">
              {focusedEvent.title}
            </h1>
            <button
              className="cursor-pointer"
              onClick={() => setFocusedEvent(null)}
            >
              <Close />
            </button>
          </hgroup>
          <div className="w-full h-[2px] bg-gray-50 my-3" />
          <h2 className="text-blue-10 font-bold uppercase mb-2">
            {new Date(focusedEvent.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }) ?? ""}
            {" @ "}
            {focusedEvent.startTime}
            {" - "}
            {focusedEvent.endTime}
          </h2>
          <div className="w-full mb-4 flex flex-row gap-2">
            {eTags.map((i: EventTag, j) => {
              return (
                <div
                  className="rounded-[8px] border-[2px] border-gray-50 p-1.5 bg-gray-70 text-gray-10 text-xs font-semibold"
                  key={j}
                >
                  {i.eventTag}
                </div>
              )
            })}
          </div>
          <div className="overflow-y-auto flex-grow relative lg:mb-4" ref={ref}>
            <RichText
              content={focusedEvent.description}
              enableProse
              enableGutter
              className="w-full px-0 prose-invert"
            />
          </div>

          {(focusedEvent.regStyle === "internal" ||
            (focusedEvent.registrationLink &&
              focusedEvent.regStyle === "external")) && (
            <div className="w-full bg-gray-80 bottom-0 left-0 pb-4 px-5 lg:relative hidden lg:flex">
              {registrationClosed ? (
                <button
                  disabled
                  className="bg-gray-60 py-4 w-full rounded-[48px] text-gray-20 text-center font-black text-3xl cursor-not-allowed"
                >
                  Registration Closed
                </button>
              ) : focusedEvent.regStyle === "external" ? (
                <a
                  href={focusedEvent.registrationLink ?? "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                  onClick={handleRegistrationClick}
                >
                  <button className="bg-blue-30 hover:bg-blue-40 transition-colors py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                    Register Now
                  </button>
                </a>
              ) : (
                <Link
                  href={`/register/event/${focusedEvent.id}`}
                  passHref
                  className="w-full"
                  onClick={handleRegistrationClick}
                >
                  <button className="bg-blue-30 hover:bg-blue-40 transition-colors py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                    Register Now
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>

        {(focusedEvent.regStyle === "internal" ||
          (focusedEvent.registrationLink &&
            focusedEvent.regStyle === "external")) && (
          <div className="w-full bg-gray-80 bottom-0 left-0 pb-4 px-5 lg:relative lg:hidden">
            {registrationClosed ? (
              <button
                disabled
                className="bg-gray-60 py-4 w-full rounded-[48px] text-gray-20 text-center font-black text-3xl cursor-not-allowed"
              >
                Registration Closed
              </button>
            ) : focusedEvent.regStyle === "external" ? (
              <a
                href={focusedEvent.registrationLink ?? "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
                onClick={handleRegistrationClick}
              >
                <button className="bg-blue-30 hover:bg-blue-40 transition-colors py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                  Register Now
                </button>
              </a>
            ) : (
              <Link
                href={`/register/event/${focusedEvent.id}`}
                passHref
                className="w-full"
                onClick={handleRegistrationClick}
              >
                <button className="bg-blue-30 hover:bg-blue-40 transition-colors py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                  Register Now
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
