'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import type { User } from '../payload-types'

interface HeaderClientProps {
  header: Header
  user: User
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, user }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  console.log('header', header)

  return (
    <header
      className="container relative z-20 py-8 flex flex-row gap-10"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <Link href="/" className='flex-none'>
        <Logo link={header.logo}/>
      </Link>
      <HeaderNav header={header}/>
      {user !== null && 
        <Link href="/admin" className='flex-none'>
            {user.name}
        </Link>
      }
    </header>
  )
}
