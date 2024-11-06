'use client'

import React from 'react'
import type { Header as HeaderType, Media, User } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import userIcon from 'public/icons/user-icon.svg'
import loginIcon from 'public/icons/login-icon.svg'
import arrowIcon from 'public/icons/right-arrowhead.svg'
import { usePathname } from 'next/navigation'

export const HeaderNav: React.FC<{ header: HeaderType, toggle: boolean, setToggle: Function, user: User }> = ({ header, toggle, setToggle, user }) => {
  const navItems = header?.navItems || []
  const pathname = usePathname()
  
  return (
    <nav 
      id="slideover"
      className={`flex md:w-full text-nowrap md:flex-row max-md:bg-[#1B1C1E] gap-12 justify-between grow text-xl max-md:transition-transform max-md:transform max-md:duration-300 max-md:ease-in-out ${toggle ? 'flex-col fixed top-0 right-0 max-md:h-full w-9/12 py-5 px-7' : 'max-md:flex-col max-md:fixed max-md:top-0 max-md:right-0 max-md:h-full max-md:w-9/12 max-md:py-5 max-md:px-7 max-md:translate-x-full'}`}
      >
      <div className='flex flex-row gap-3 text-[#A6A8AB] text-2xl hover:cursor-pointer md:hidden' onClick={() => setToggle(false)}>
        <Image
          alt='right-arrow-icon'
          src={arrowIcon}
          width={arrowIcon?.width ?? 0}
          height={arrowIcon?.height ?? 0}
        />
        CLOSE
      </div>

      <div className='flex flex-col gap-6 grow md:flex-row md:gap-10 max-md:text-right max-md:font-extrabold max-md:text-4xl text-[#F3F3F3]'>
        {(toggle && pathname !== '/') &&
          <Link href={'/'} className='active:text-[#818488] md:hover:underline md:hover:underline-offset-8' onClick={() => setToggle(false)}>HOME</Link>
        }
        {toggle ? navItems.map(({ link }, i) => (
          link.url !== pathname && (
            <Link key={i} href={link.url ?? ""} className='active:text-[#818488] md:hover:underline md:hover:underline-offset-8' onClick={() => setToggle(false)}>
              {link.label !== "ACADEMIC ARCHIVE" ? link.label : "ARCHIVE"}
            </Link>
          ))
        ) : (
          navItems.map(({ link }, i) => {
            return (
              <Link key={i} href={link.url ?? ""} className='active:text-[#818488] md:hover:underline md:hover:underline-offset-8' onClick={() => setToggle(false)}>
                {link.label}
              </Link>
            )
          }
        ))}
      </div>

      <div className=''>
        <Link href="/admin" className="flex flex-row items-center gap-3 text-xl">
          <Image 
            alt={user !== null ? 'user-icon' : 'login-icon'}
            src={user !== null ? userIcon : loginIcon}
            width={userIcon.width ?? 0}
            height={userIcon.height ?? 0} 
          />
          {user !== null ? user.name : 'LOG IN'}
        </Link>
      </div>
    </nav>
  )
}
