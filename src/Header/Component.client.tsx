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
  icons: Media[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, user, icons }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const userIcon = icons.find(icon => icon.alt === 'user-icon')
  const menuIcon = icons.find(icon => icon.alt === 'hamburger-icon')

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
      className="flex md:gap-16 relative z-20 md:py-8 py-3 md:px-10 px-5 font-['Montserrat'] font-bold md:justify-between justify-end items-center"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className='max-md:hidden'>
        <Link href="/" className=''>
          <Logo link={header.logo}/>
        </Link>
      </div>
      <HeaderNav header={header} user={user} userIcon={userIcon} />
      <div className='hover:cursor-pointer md:hidden'>
        {menuIcon &&
          <Image 
            alt={menuIcon.alt}
            src={menuIcon.url ?? ''}
            width={menuIcon.width ?? 0}
            height={menuIcon.height ?? 0}
            onClick={() => {}}
          />
        }
      </div>
    </header>
  )
}
