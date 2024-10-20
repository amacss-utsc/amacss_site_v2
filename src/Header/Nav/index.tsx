'use client'

import React, { useEffect } from 'react'

import type { Header as HeaderType, Media, User } from '@/payload-types'

import Link from 'next/link'
import Image from 'next/image'

export const HeaderNav: React.FC<{ header: HeaderType, toggle: boolean, setToggle: Function, user: User, userIcon: Media | undefined, arrowIcon: Media | undefined }> = ({ header, toggle, setToggle, user, userIcon, arrowIcon }) => {
  const navItems = header?.navItems || []
  
  return (
    <nav 
      id="slideover"
      className={`flex md:flex-row max-md:bg-[#1B1C1E] gap-12 justify-between grow text-xl max-md:transition-transform max-md:transform max-md:duration-300 max-md:ease-in-out ${toggle ? 'flex-col fixed top-0 right-0 h-screen w-10/12 py-9 px-10' : 'max-md:flex-col max-md:fixed max-md:top-0 max-md:right-0 max-md:h-screen max-md:w-10/12 max-md:py-9 max-md:px-10 max-md:translate-x-full'}`}
      >
      <div className='flex flex-row gap-3 text-[#A6A8AB] text-2xl hover:cursor-pointer md:hidden' onClick={() => setToggle(false)}>
        <Image
          alt={arrowIcon?.alt ?? ''}
          src={arrowIcon?.url ?? ''}
          width={arrowIcon?.width ?? 0}
          height={arrowIcon?.height ?? 0}
        />
        CLOSE
      </div>

      <div className='flex flex-col max-md:gap-8 grow md:flex-row md:gap-10 max-md:text-right max-md:font-extrabold max-md:text-4xl'>
        {navItems.map(({ link }, i) => {
          return (
            <Link href={link.url ?? ""} className='active:text-[#818488] md:hover:underline md:hover:underline-offset-8'>
              {link.label !== "ACADEMIC ARCHIVE" ? link.label : "ARCHIVE"}
            </Link>
          )
        })}
      </div>

      <div className=''>
        <Link href="/admin" className="flex flex-row items-center gap-3 text-xl">
          {userIcon && 
            <Image 
              alt={userIcon.alt}
              src={userIcon.url ?? ''}
              width={userIcon.width ?? 0}
              height={userIcon.height ?? 0} 
            />
            }
          {user !== null ? user.name : 'Sign In'}
        </Link>
      </div>
    </nav>
  )
}
