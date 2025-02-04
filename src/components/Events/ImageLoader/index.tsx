"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'

const EventLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-80">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-30 border-t-blue-30"></div>
  </div>
)

export const EventImageWithLoader = ({ 
  src, 
  alt, 
  width, 
  height, 
  className 
}: {
  src: string
  alt: string
  width: number
  height: number
  className: string
}) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative h-[300px] w-full">
      {isLoading && <EventLoader />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          className,
          'transition-opacity duration-300 object-cover',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  )
}

const CompactLoader = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-14 w-14 border-[3px] border-gray-30 border-t-blue-30"></div>
    </div>
  )
  
  export const CompactEventImageWithLoader = ({ 
    src, 
    alt, 
    width, 
    height, 
    className 
  }: {
    src: string
    alt: string
    width: number
    height: number
    className: string
  }) => {
    const [isLoading, setIsLoading] = useState(true)
  
    return (
      <div className="relative w-[218px] h-[189px]">
        {isLoading && <CompactLoader />}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            className,
            'transition-opacity duration-300 object-cover',
            'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
    )
  }