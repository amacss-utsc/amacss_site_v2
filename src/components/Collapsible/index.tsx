'use client'

import { cn } from '@/utilities/cn'
import React, { ReactNode, FC, useState } from 'react'
import ChevronRight from '../svg/ChevronRight'

type CollapsibleProps = {
  title: string
  children: ReactNode
  className?: string
}

const Collapsible: FC<CollapsibleProps> = ({ title, children, className = '' }) => {
  const [open, setOpen] = useState(true)

  return (
    <div
      className={cn('cursor-pointer lg:cursor-default', className)}
      onClick={() => {
        setOpen(!open)
      }}
      role="group"
      tabIndex={0}
    >
      <hgroup className="text-gray-10 flex items-center justify-between mb-3">
        <h4 className="font-semibold leading-6 normal-case tracking-[5%] text-[20px]">{title}</h4>
        <ChevronRight className={cn("transition-all", open ? "-rotate-90" : "rotate-90")} />
      </hgroup>
      <div className="" onClick={(e) => e.stopPropagation()}>{open && children}</div>
    </div>
  )
}

export default Collapsible

