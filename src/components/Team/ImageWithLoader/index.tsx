"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utilities/cn';

const Loader = () => (
    <div className="w-64 h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-30 border-t-blue-30"></div>
    </div>
  );

export const ImageWithLoader = ({ src, alt, width, height, className }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
  }) => {
    const [isLoading, setIsLoading] = useState(true);
  
    return (
      <div className="relative">
        {isLoading && <Loader />}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            className,
            'transition-opacity duration-300',
            isLoading ? 'opacity-0 h-0' : 'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
    );
  };