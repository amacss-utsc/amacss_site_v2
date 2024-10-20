'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import type { User } from '../payload-types'
import Image from 'next/image'
import menuIcon from 'public/icons/hamburger-icon.svg';

interface HeaderClientProps {
  header: Header
  user: User,
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, user }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [toggle, setToggle] = useState<boolean>(false)
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

  return (
    <header
      className="flex md:gap-16 w-full z-20 md:py-6 py-3 md:px-10 px-5 font-['Montserrat'] font-bold justify-between items-center md:bg-[#1B1C1E]"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div>
        <div className='max-md:hidden'>
          <Link href="/" className=''>
            <Logo link={header.logo}/>
          </Link>
        </div>

        {pathname !== '/' &&
          <div className='md:hidden font-extrabold text-4xl pt-2 tracking-widest'>
            {header.navItems?.find(({ link }) => pathname === link.url)?.link.label || ''}
          </div>
        }
      </div>

      <HeaderNav header={header} toggle={toggle} setToggle={setToggle} user={user} />
      
      <div className={`hover:cursor-pointer md:hidden`}>
        {menuIcon &&
          <Image 
            alt='menu-icon'
            src={menuIcon}
            width={menuIcon.width ?? 0}
            height={menuIcon.height ?? 0}
            onClick={() => {
                setToggle(!toggle)
            }}
          />
        }
      </div>
    </header>
  )
}
