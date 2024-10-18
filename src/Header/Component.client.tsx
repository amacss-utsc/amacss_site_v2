'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Media } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import type { User } from '../payload-types'
import Image from 'next/image'

interface HeaderClientProps {
  header: Header
  user: User,
  navIcon: Media
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, user, navIcon }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const isDashboard = pathname !== '/'

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="flex flex-row gap-16 relative z-20 py-8 px-10 font-['Montserrat'] font-bold"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className='flex-none'>
        <Link href="/" className='flex-none'>
          <Logo link={header.logo}/>
        </Link>
      </div>
      {isDashboard ? <HeaderNav header={header}/> : <div className='grow'/>}
      <div className=''>
        <Link href="/admin" className="flex flex-row items-center gap-3">
          <Image 
            alt={navIcon.alt}
            src={navIcon.url ?? ''}
            width={navIcon.width ?? 0}
            height={navIcon.height ?? 0} 
          />
          {user !== null ? user.name : 'Sign In'}
        </Link>
      </div>
    </header>
  )
}
