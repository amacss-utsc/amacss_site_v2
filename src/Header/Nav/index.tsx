'use client'

import React from 'react'

import type { Header as HeaderType, Media, User } from '@/payload-types'

import Link from 'next/link'
import Image from 'next/image'

export const HeaderNav: React.FC<{ header: HeaderType, user: User, userIcon: Media | undefined }> = ({ header, user, userIcon }) => {
  const navItems = header?.navItems || []
  // flex flex-col md:flex-row items-center text-center text-base justify-between
  return (
    <nav className="bg-[#1B1C1E] absolute top-0 right-0 flex flex-col gap-8 justify-between h-screen w-10/12 py-9 px-10 text-xl">
      <div className='text-[#A6A8AB]'>
        CLOSE
      </div>

      <div className='menu flex flex-col gap-5 md:flex-row md:gap-10 grow'>
        {navItems.map(({ link }, i) => {
          return (
            <Link href={link.url ?? ""} className='hover:underline hover:underline-offset-8'>
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className=''>
        <Link href="/admin" className="flex flex-row items-center gap-3">
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
