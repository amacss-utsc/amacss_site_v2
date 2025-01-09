import type { Metadata } from 'next'

import { cn } from 'src/utilities/cn'
import React from 'react'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import Nav from '@/components/Nav'
import { Providers } from '@/providers'
import { EventModal } from '@/components/Events/Modal'
import { FilterModal } from '@/components/Events/Filter'
import { DesktopNav, DesktopSidebar } from '@/components/DesktopNav'
import { ErrDefault, FetchEvents, FetchEventTags } from './_data'

const mtsrt = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const { events, error } = await FetchEvents()

  const e = ErrDefault(error, events, [])

  const { tags, error: et } = await FetchEventTags()

  const t = ErrDefault(et, tags, [])

  return (
    <html className={cn(mtsrt.className, "bg-gray-90")} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <title>AMACSS | Association of Mathematical and Computer Science Students</title>
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
              <div className="relative w-full h-full lg:rounded-tl-[32px] overflow-hidden">
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
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
