"use client"
import React from "react"
import A from "@/components/svg/A"
import Logo from "@/components/svg/Logo"
import { colors } from "@/utilities/colors"
import { LottieBackground } from "@/components/LottieBackground"

export const Title: React.FC = () => {
  const galaUrl = process.env.NEXT_PUBLIC_GALA_URL
  const galaSignup = galaUrl ? (
    <a
      className="inline-flex items-center justify-center rounded-full bg-blue-30 px-8 py-4 text-base font-semibold text-gray-02 hover:bg-blue-20 transition-colors mt-10"
      href={galaUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      🎉 Sign up for the 2026 CMS Gala! 🎉
    </a>
  ) : null

  return (
    <section className="w-full h-screen relative flex items-center justify-center flex-col">
      <LottieBackground />
      
      <div className="w-full h-screen flex items-center justify-center lg:hidden flex-col">
        <A className="mb-2.5 lg:hidden" />
        <Logo fill={colors.gray["02"]} className="lg:hidden" />
        {galaSignup}
      </div>
      <Logo
        fill={colors.gray["02"]}
        width={887.52}
        height={126.57}
        className="hidden lg:block"
      />
      <h1 className="hidden lg:block text-gray-02 font-bold text-[27.5px]">
        Association of Mathematical and Computing Science Students
      </h1>
      {galaSignup ? <div className="hidden lg:flex">{galaSignup}</div> : null}
    </section>
  )
}

