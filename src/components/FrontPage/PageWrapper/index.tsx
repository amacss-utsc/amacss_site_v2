"use client"
import React, { useEffect, useRef } from "react"
import { useStateContext } from "@/providers/State"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type PageWrapperProps = {
  children: React.ReactNode
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const { setMenuOpen } = useStateContext()
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=1",
      onEnter: () => setMenuOpen(true),
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [setMenuOpen])

  return (
    <main ref={triggerRef} className="w-full bg-gray-90 lg:rounded-[32px] overflow-x-hidden">
      {children}
    </main>
  )
}

