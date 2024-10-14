import React from 'react'
import Image from 'next/image'
import { Media } from '../Media'

export const Logo = ({ link }) => {
  console.log("link", link)
  return (
    /* eslint-disable @next/next/no-img-element */
    <Image
      alt={link.alt}
      className="max-w-[9.375rem] invert dark:invert-0"
      src={link.url}
      width={link.width}
      height={link.height}
    />
  )
}
