"use client"

import React, { useState } from "react"
import Image from "next/image"
import { cn } from "@/utilities/cn"

type Props = {
  src: string
  alt: string
  size?: number
  className?: string
  imgClassName?: string
}

const Spinner = () => (
  <div className="h-6 w-6 animate-spin rounded-full border-4 border-white/20 border-t-white/70" />
)

export default function AvatarImageWithLoader({
  src,
  alt,
  size = 112,
  className,
  imgClassName,
}: Props) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div className="absolute inset-0 grid place-items-center">
          <Spinner />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          imgClassName,
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  )
}
