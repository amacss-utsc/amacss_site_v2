'use client'

import React, { useEffect } from 'react'

import type { Header as HeaderType, Media, User } from '@/payload-types'

import Link from 'next/link'
import Image from 'next/image'

export const HeaderNav: React.FC<{ header: HeaderType, toggle: boolean, setToggle: Function, user: User, userIcon: Media | undefined, arrowIcon: Media | undefined }> = ({ header, toggle, setToggle, user, userIcon, arrowIcon }) => {
  const navItems = header?.navItems || []
  // flex flex-col md:flex-row items-center text-center text-base justify-between

  return (
    <nav className={`flex md:flex-row max-md:bg-[#1B1C1E] gap-12 justify-between text-xl ${toggle && 'flex-col absolute top-0 right-0 h-screen w-10/12 py-9 px-10'} ${!toggle && 'max-md:hidden'}`}>
      <div className='flex flex-row gap-3 text-[#A6A8AB] text-2xl hover:cursor-pointer md:hidden' onClick={() => {setToggle(false)}}>
        <Image
          alt={arrowIcon?.alt ?? ''}
          src={arrowIcon?.url ?? ''}
          width={arrowIcon?.width ?? 0}
          height={arrowIcon?.height ?? 0}
        />
        CLOSE
      </div>

      <div className='menu flex flex-col max-md:gap-8 md:flex-row md:gap-10 grow max-md:text-right max-md:font-extrabold max-md:text-4xl'>
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
