"use client"
import dynamic from "next/dynamic"
import topLeft from "@/utilities/lottie/desktop-top-left.json"
import bottomLeft from "@/utilities/lottie/desktop-bottom-left.json"
import topRight from "@/utilities/lottie/desktop-top-right.json"
import bottomRight from "@/utilities/lottie/desktop-bottom-right.json"
import center from "@/utilities/lottie/desktop-center.json"
import mobileAnimation from "@/utilities/lottie/mobile.json"

const Lottie = dynamic(() => import("lottie-react").then((module) => module.Lottie), { ssr: false })

export const LottieBackground = () => {
  return (
    <div>
      <div className="hidden lg:block absolute w-[150%] h-full -top-1/2 -left-2/3 opacity-50 pointer-events-none">
        <Lottie
          src={topLeft}
          loop
          autoplay
        />
      </div>

      <div className="hidden lg:block absolute w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
        <Lottie
          src={topRight}
          loop
          autoplay
        />
      </div>

      <div className="hidden lg:block absolute w-3/4 h-3/4 -top-1/4 -right-1/4 opacity-50 pointer-events-none">
        <Lottie
          src={center}
          loop
          autoplay
        />
      </div>

      <div className="hidden lg:block absolute w-3/4 h-3/4 -left-1/4 -bottom-1/3 opacity-50 pointer-events-none">
        <Lottie
          src={bottomLeft}
          loop
          autoplay
        />
      </div>

      <div className="hidden lg:block absolute w-full h-full -right-1/2 -bottom-1/2 pointer-events-none">
        <Lottie
          src={bottomRight}
          loop
          autoplay
        />
      </div>

      <div className="w-screen lg:hidden h-screen absolute top-0 left-0 opacity-50 pointer-events-none">
        <Lottie
          src={mobileAnimation}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        />
      </div>
    </div>
  )
}
