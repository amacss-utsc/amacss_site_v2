import React from 'react'
import Image from 'next/image'

export const Logo = ({ link }) => {
  return link ? (
    /* eslint-disable @next/next/no-img-element */
    <Image
      alt={link.alt}
      className="max-w-[9.375rem] invert dark:invert-0"
      src={link.url}
      width={link.width}
      height={link.height}
    />
  ) : (
    <span className='text-white underline'>
      Set logo in admin panel
    </span>
  );
}