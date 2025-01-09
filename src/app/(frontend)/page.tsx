"use client"
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import A from "@/components/svg/A";
import Logo from "@/components/svg/Logo";
import { useStateContext } from "@/providers/State";
import { colors } from "@/utilities/colors";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import desktopAnimation from "@/utilities/lottie/desktop.json"
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
          {/* <div
            className="hidden lg:block w-screen h-screen absolute -top-10 -left-10 opacity-50 "
          >
            <Lottie
              //@ts-ignore
              options={{ loop: true, autoplay: true, animationData: desktopAnimation }}
            />
          </div> */}
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

