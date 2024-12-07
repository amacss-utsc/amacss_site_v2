'use client'
import { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import animationData from '../../assets/desktop.json'
import image from '../../assets/amacss-logo.png'
import login from '../../assets/login.png'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

export default function DesktopDashboard() {
  useEffect(() => {
    window.scrollTo(0, 115)
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen w-full relative bg-[#1E1E1E]">
        <div className="relative w-full h-full">
          <Lottie options={defaultOptions} height={window.innerHeight} width={window.innerWidth} />

          <img
            src={image.src}
            alt="AMACSS Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
          />
        </div>
    </div>
  )
}
