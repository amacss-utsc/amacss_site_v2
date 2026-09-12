"use client"
import React from "react"
import A from "@/components/svg/A"
import Logo from "@/components/svg/Logo"
import { colors } from "@/utilities/colors"
import { LottieBackground } from "@/components/LottieBackground"

export const Title: React.FC = () => {
  return (
    <section className="w-full min-h-[92vh] relative flex items-center justify-center flex-col">
      <LottieBackground />
      
      <div className="w-full h-screen flex items-center justify-center lg:hidden flex-col">
        <A className="mb-2.5 lg:hidden" />
        <Logo fill={colors.gray["02"]} className="lg:hidden" />
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
    </section>
  )
}

