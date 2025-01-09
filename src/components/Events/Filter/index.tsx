"use client"

import { useStateContext } from "@/providers/State"
import { useRef } from "react"
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ChevronRight from "@/components/svg/ChevronRight"
import Collapsible from "@/components/Collapsible"
import { cn } from "@/utilities/cn"
import Check from "@/components/svg/Check"
import { DatePicker } from "@/components/ui/datepicker"

export const FilterModal = () => {
  const {
    filterOpen,
    setFilterOpen,
    tags,
    tagsIndices,
    setTagsIndices,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useStateContext()

  const ref = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        menu.current,
        {
          y: '100%',
        },
        {
          y: 0,
          ease: 'power3.out',
          duration: 0.3,
        },
      )
    },
    { dependencies: [filterOpen], scope: ref },
  )

  const { contextSafe } = useGSAP({ scope: ref })

  const onHide = contextSafe(() => {
    gsap.to(menu.current, { y: '100%', ease: 'power3.out', duration: 0.3 })
    setTimeout(() => setFilterOpen(false), 350)
  })

  if (!filterOpen) return null
  else
    return (
      <div className="fixed z-40 w-full top-1/2 flex items-center justify-center uppercase ">
        <div
          className="z-40 flex flex-col-reverse absolute w-full h-screen bg-gray-90 bg-opacity-50 backdrop-blur lg:rounded-[5px] "
          onClick={onHide}
        >
          <div
            ref={menu}
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="bg-gray-70 w-full h-[50%] text-gray-10 rounded-t-[32px] relative p-6 pt-4 overflow-scroll"
          >
            <button
              onClick={onHide}
              className="flex font-bold leading-6 text-2xl uppercase items-center justify-start">

              <ChevronRight className="rotate-90 inline mr-4" />
              Close
            </button>

            <Collapsible title={"Tags"} className="mt-6">
              {tags.map((i, j) => {
                return (
                  <div
                    key={j}
                    className="flex items-center space-x-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (tagsIndices.includes(j))
                        setTagsIndices(tagsIndices.filter(tij => tij != j))
                      else
                        setTagsIndices([...tagsIndices, j])

                    }}
                  >
                    <div className={cn(
                      tagsIndices.includes(j) ? "bg-blue-20 border-blue-20" : "border-gray-10",
                      "w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center")}
                    >
                      {tagsIndices.includes(j) && <Check />}
                    </div>

                    <p className={cn("select-none text-lg font-normal normal-case", tagsIndices.includes(j) ? "text-gray-02" : "text-gray-10")}>
                      {i}
                    </p>
                  </div>
                )
              })}
            </Collapsible>

            <div className="h-7 w-full" />

            <Collapsible title={"Date Range"}>
              <div className="flex flex-col normal-case">
                <label>Start Date</label>
                <DatePicker fDate={startDate || new Date()} fsetDateAction={setStartDate} className=""/>
                <label>End Date</label>
                <DatePicker fDate={endDate || new Date()} fsetDateAction={setEndDate} className=""/>
              </div>
            </Collapsible>

          </div>
        </div>
      </div>
    )
}

