"use client";

import RichText from "@/components/RichText";
import ChevronDown from "@/components/svg/ChevronDown";
import Close from "@/components/svg/Close";
import { EventTag } from "@/payload-types";
import { useStateContext } from "@/providers/State";
import { cn } from "@/utilities/cn";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const EventModal = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { focusedEvent, setFocusedEvent } = useStateContext();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [overflowing, setOverflowing] = useState(false);

  const handleScroll = () => {
    const element = ref.current;
    if (element) {
      const totalScrollableHeight = element.scrollHeight - element.clientHeight;
      const currentScroll = element.scrollTop;
      const progress = (currentScroll / totalScrollableHeight) * 100;
      setScrollProgress(progress);
    }
  };

  const handleChevronClick = () => {
    const element = ref.current;
    if (element) {
      const totalScrollableHeight = element.scrollHeight - element.clientHeight;
      const currentScroll = element.scrollTop;
      const visibleHeight = element.clientHeight;
      const step = visibleHeight * 0.95;

      const nS =
        scrollProgress >= 95
          ? Math.max(currentScroll - step, 0)
          : Math.min(currentScroll + step, totalScrollableHeight);

      element.scrollTo({
        top: nS,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      setOverflowing(element.scrollHeight > element.clientHeight);

      element.addEventListener("scroll", handleScroll);

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [ref, focusedEvent]);

  if (focusedEvent === null) return null;

  const im =
    typeof focusedEvent.image !== "number" ? focusedEvent.image : null;

  if (im === null) {
    setFocusedEvent(null);
    return null;
  }

  const { url, alt, width, height } = im;

  if (!url || !alt || width == null || height == null) return null;

  const eTags = typeof focusedEvent?.eventTag !== "number" ? focusedEvent.eventTag : []

  return (
    <div className="w-screen h-screen absolute top-0 left-0 z-50 overflow-hidden lg:w-full lg:h-full lg:flex lg:items-center lg:justify-center lg:bg-gray-90 lg:bg-opacity-60 lg:backdrop-blur">
      <div className="w-screen h-screen flex flex-col lg:w-[833px] lg:h-[545px] relative lg:rounded-[32px] overflow-hidden lg:flex-row">
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          className="w-full min-h-[40%] max-h-[40%] lg:h-full lg:max-h-full lg:min-h-full lg:min-w-[55%] object-cover bg-white"
        />
        <div className="bg-white flex-grow px-5 pt-3 overflow-hidden flex flex-col relative lg:w-full ">
          {overflowing && (
            <div className={cn(focusedEvent.registrationLink ? "bottom-[84px]" : "bottom-0", "absolute right-0 w-full bg-gradient-to-b from-white/0 to-white h-[95px] z-10 flex items-center justify-center")}>
              <button
                className="animate-bob"
                onClick={handleChevronClick}
              >
                <ChevronDown
                  className={cn(
                    "transition-all",
                    scrollProgress >= 95 && "rotate-180"
                  )}
                />
              </button>
            </div>
          )}
          <hgroup className="flex items-center justify-between w-full">
            <h1 className="text-gray-90 font-bold uppercase text-4xl">
              {focusedEvent.title}
            </h1>
            <button
              className="cursor-pointer"
              onClick={() => setFocusedEvent(null)}
            >
              <Close />
            </button>
          </hgroup>
          <div className="w-full h-[3px] bg-gray-90 my-2" />
          <h2 className="text-gray-90 font-bold uppercase mb-2">
            {new Date(focusedEvent.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }) ?? ""}
            {" @ "}
            {focusedEvent.startTime}
            {" - "}
            {focusedEvent.endTime}
          </h2>
          <div className="w-full mb-4 flex flex-row gap-2">
            {eTags.map((i: EventTag, j) => {
              return (
                <div className="rounded-[8px] border-[2px] border-gray-05 p-1.5 bg-gray-02 text-black text-xs font-semibold text-opacity-40" key={j}>
                  {i.eventTag}
                </div>
              )
            })}
          </div>
          <div className="overflow-y-auto flex-grow relative" ref={ref}>
            <RichText
              content={focusedEvent.description}
              enableProse
              enableGutter
              className="w-full px-0"
            />
          </div>

          {(focusedEvent.regStyle === "internal" ||
            (focusedEvent.registrationLink && focusedEvent.regStyle === "external")) && (
              <div className="w-full bg-white bottom-0 left-0 pb-4 px-5 lg:relative hidden lg:flex">
                {focusedEvent.regStyle === "external" ? (
                  <a
                    href={focusedEvent.registrationLink ?? "/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <button
                      onClick={() => setFocusedEvent(null)}
                      className="bg-blue-30 py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                      Register Now
                    </button>
                  </a>
                ) : (
                  <Link href={`/register/event/${focusedEvent.id}`} passHref className="w-full">
                    <button
                      onClick={() => setFocusedEvent(null)}
                      className="bg-blue-30 py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                      Register Now
                    </button>
                  </Link>
                )}
              </div>
            )}


        </div>

        {(focusedEvent.regStyle === "internal" ||
          (focusedEvent.registrationLink && focusedEvent.regStyle === "external")) && (
            <div className="w-full bg-white bottom-0 left-0 pb-4 px-5 lg:relative lg:hidden">
              {focusedEvent.regStyle === "external" ? (
                <a
                  href={focusedEvent.registrationLink ?? "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <button className="bg-blue-30 py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                    Register Now
                  </button>
                </a>
              ) : (
                <Link href={`/register/event/${focusedEvent.id}`} passHref className="w-full">
                  <button
                    onClick={() => setFocusedEvent(null)}
                    className="bg-blue-30 py-4 w-full rounded-[48px] text-white text-center font-black text-3xl">
                    Register Now
                  </button>
                </Link>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

