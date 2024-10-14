'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []

  return (
    <nav className="flex grow flex-nowrap gap-10 items-center font-bold text-center text-base font-['Montserrat']">
      {navItems.map(({ link }, i) => {
        return (
            <Link href={link.url ?? ""} className='hover:underline hover:underline-offset-8'>
                {link.label}
            </Link>
        )
      })}
    </nav>
  )
}
