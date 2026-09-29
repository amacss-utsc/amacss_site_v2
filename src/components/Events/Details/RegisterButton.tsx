"use client"

import type { Event } from "@/payload-types"
import { EVENT_REGISTRATION_OPEN } from "@/utilities/auth"
import { cn } from "@/utilities/cn"
import Link from "next/link"
import type { FC, MouseEvent } from "react"
import { toast } from "react-hot-toast"
import { getRegistrationHref } from "./utils"

const showRegistrationPausedToast = () =>
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

type Props = {
  event: Event
  className?: string
  onNavigate?: () => void
}

export const EventRegisterButton: FC<Props> = ({
  event,
  className,
  onNavigate,
}) => {
  const href = getRegistrationHref(event)
  if (!href) return null

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!EVENT_REGISTRATION_OPEN) {
      e.preventDefault()
      showRegistrationPausedToast()
      return
    }
    onNavigate?.()
  }

  const buttonClassName = cn(
    "block bg-blue-30 hover:bg-blue-40 py-4 w-full rounded-[48px] text-white text-center font-black text-3xl transition-colors",
    className,
  )

  if (event.regStyle === "external") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName}
        onClick={handleClick}
      >
        Register Now
      </a>
    )
  }

  return (
    <Link href={href} className={buttonClassName} onClick={handleClick}>
      Register Now
    </Link>
  )
}
