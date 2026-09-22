import type { Metadata } from "next"
import type { PaginatedDocs } from "payload"
import type { Event } from "@/payload-types"

import { cn } from "src/utilities/cn"
import React from "react"

import { LivePreviewListener } from "@/components/LivePreviewListener"
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { getServerSideURL } from "@/utilities/getURL"
import Nav from "@/components/Nav"
import { Providers } from "@/providers"
import { EventModal } from "@/components/Events/Modal"
import { FilterModal } from "@/components/Events/Filter"
import { DesktopNav, DesktopSidebar } from "@/components/DesktopNav"
import { ErrDefault, FetchEventTags, FetchSidebarEvents } from "./_data"
import { Toaster } from "react-hot-toast"

const mtsrt = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

// The shared navigation reads live Payload data. Rendering it at request time
// keeps Vercel builds independent of database availability and avoids baking
// stale sidebar events into every statically generated page.
export const dynamic = "force-dynamic"

const emptySidebarEvents: PaginatedDocs<Event> = {
  docs: [],
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  page: 1,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let e = emptySidebarEvents
  let t: string[] = []

  try {
    const { events, error } = await FetchSidebarEvents()
    e = ErrDefault(error, events, emptySidebarEvents)

    const { tags, error: et } = await FetchEventTags()
    t = ErrDefault(et, tags, [])
  } catch (error) {
    // Navigation content is optional. A temporary Payload outage should not
    // prevent members from reaching login, signup, or account recovery.
    console.error("Navigation data unavailable:", error)
  }

  return (
    <html
      className={cn(mtsrt.className, "bg-gray-90")}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <title>
          AMACSS | Association of Mathematical and Computer Science Students
        </title>
      </head>
      <Providers>
        <body className="relative">
          <LivePreviewListener />
          <Nav />
          <FilterModal />
          <div className="w-screen h-screen lg:flex lg:flex-row">
            <DesktopSidebar events={e} tags={t} />
            <div className="w-full h-full lg:flex lg:flex-col bg-gray-80 relative">
              <DesktopNav />
              <div className="relative w-full h-full lg:rounded-tl-[32px] overflow-y-auto">
                <Toaster position="top-right" />
                <EventModal />
                {children}
              </div>
            </div>
          </div>
        </body>
      </Providers>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@payloadcms",
  },
}
