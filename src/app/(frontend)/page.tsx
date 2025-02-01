"use client"
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import A from "@/components/svg/A";
import Logo from "@/components/svg/Logo";
import { useStateContext } from "@/providers/State";
import { colors } from "@/utilities/colors";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import topLeft from "@/utilities/lottie/desktop-top-left.json"
import bottomLeft from "@/utilities/lottie/desktop-bottom-left.json"
import topRight from "@/utilities/lottie/desktop-top-right.json"
import bottomRight from "@/utilities/lottie/desktop-bottom-right.json"
import center from "@/utilities/lottie/desktop-center.json"
import mobileAnimation from "@/utilities/lottie/mobile.json"
import canUseDOM from "@/utilities/canUseDOM";

gsap.registerPlugin(ScrollTrigger);

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export default function Page() {
  const { setMenuOpen } = useStateContext();
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=1",
      onEnter: () => setMenuOpen(true),
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setMenuOpen]);

  const mounted = canUseDOM

  return (
    <main
      ref={triggerRef}
      className="w-full scrollhider bg-gray-90 h-[120vh] lg:relative lg:h-full lg:rounded-[32px] lg:flex lg:items-center lg:justify-center lg:flex-col"
    >
      {mounted &&
        <>
          <div
            className="hidden lg:block absolute w-[150%] h-full -top-1/2 -left-2/3 opacity-50"
          >
            <Lottie
              //@ts-ignore
              options={{ loop: true, autoplay: true, animationData: topLeft }}
              isClickToPauseDisabled={true}
            />
          </div>

          <div
            className="hidden lg:block absolute w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
          >
            <Lottie
              //@ts-ignore
              options={{ loop: true, autoplay: true, animationData: topRight }}
              isClickToPauseDisabled={true}
            />
          </div>

          <div
            className="hidden lg:block absolute w-3/4 h-3/4 -top-1/4 -right-1/4 opacity-50"
          >
            <Lottie
              //@ts-ignore
              options={{ loop: true, autoplay: true, animationData: center }}
              isClickToPauseDisabled={true}
            />
          </div>

          <div
            className="hidden lg:block absolute w-3/4 h-3/4 -left-1/4 -bottom-1/3 opacity-50"
          >
            <Lottie
              //@ts-ignore
              options={{ loop: true, autoplay: true, animationData: bottomLeft }}
              isClickToPauseDisabled={true}
            />
          </div>

          <div
            className="hidden lg:block absolute w-full h-full -right-1/2 -bottom-1/2"
          >
            <Lottie
              //@ts-ignore
              options={{ loop: true, autoplay: true, animationData: bottomRight }}
              isClickToPauseDisabled={true}
            />
          </div>
          <div
            className="w-screen lg:hidden h-screen absolute top-0 left-0 opacity-50 "
          >
            <Lottie
              //@ts-ignore
              options={{
                loop: true,
                autoplay: true,
                animationData: mobileAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                }
              }}
              isClickToPauseDisabled={true}
            />
          </div>
        </>
      }
      <div className="w-screen h-screen flex items-center justify-center lg:hidden flex-col sticky top-0 left-0">
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
        Association of Mathematical and Computer Science Students
      </h1>
    </main>
  );
}

