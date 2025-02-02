"use client"
import React from "react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import topLeft from "@/utilities/lottie/desktop-top-left.json"
import bottomLeft from "@/utilities/lottie/desktop-bottom-left.json"
import topRight from "@/utilities/lottie/desktop-top-right.json"
import bottomRight from "@/utilities/lottie/desktop-bottom-right.json"
import center from "@/utilities/lottie/desktop-center.json"
import mobileAnimation from "@/utilities/lottie/mobile.json"
import canUseDOM from "@/utilities/canUseDOM"

const Lottie = dynamic(() => import("react-lottie"), { ssr: false })

export const LottieBackground = () => {
  const mounted = canUseDOM

  if (!mounted) return null

  return (
    <>
      <div className="hidden lg:block absolute w-[150%] h-full -top-1/2 -left-2/3 opacity-50">
        <Lottie
          // @ts-ignore
          options={{ loop: true, autoplay: true, animationData: topLeft }}
          isClickToPauseDisabled={true}
        />
      </div>

      <div className="hidden lg:block absolute w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
        <Lottie
          // @ts-ignore
          options={{ loop: true, autoplay: true, animationData: topRight }}
          isClickToPauseDisabled={true}
        />
      </div>

      <div className="hidden lg:block absolute w-3/4 h-3/4 -top-1/4 -right-1/4 opacity-50">
        <Lottie
          // @ts-ignore
          options={{ loop: true, autoplay: true, animationData: center }}
          isClickToPauseDisabled={true}
        />
      </div>

      <div className="hidden lg:block absolute w-3/4 h-3/4 -left-1/4 -bottom-1/3 opacity-50">
        <Lottie
          // @ts-ignore
          options={{ loop: true, autoplay: true, animationData: bottomLeft }}
          isClickToPauseDisabled={true}
        />
      </div>

      <div className="hidden lg:block absolute w-full h-full -right-1/2 -bottom-1/2">
        <Lottie
          // @ts-ignore
          options={{ loop: true, autoplay: true, animationData: bottomRight }}
          isClickToPauseDisabled={true}
        />
      </div>

      <div className="w-screen lg:hidden h-screen absolute top-0 left-0 opacity-50">
        <Lottie
          // @ts-ignore
          options={{
            loop: true,
            autoplay: true,
            animationData: mobileAnimation,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          isClickToPauseDisabled={true}
        />
      </div>
    </>
  )
}
