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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    window.scrollTo(0, 200)
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen w-full relative bg-[#1E1E1E]">
      {isClient && (
        <div className="relative w-full h-full">
          <Lottie options={defaultOptions} height={window.innerHeight} width={window.innerWidth} />

          {/* Nav Bar */}
          <div className="fixed top-0 left-0 w-full bg-[#1E1E1E] text-white shadow-lg z-50">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex gap-6">
                <a
                  href="https://google.com/"
                  className="text-sm cursor-pointer font-bold font-montserrat hover:bg-gray-700 px-3 py-1 rounded-md"
                >
                  EVENTS
                </a>
                <a
                  href="https://google.com/"
                  className="text-sm cursor-pointer font-bold font-montserrat hover:bg-gray-700 px-3 py-1 rounded-md"
                >
                  OUR TEAM
                </a>
                <a
                  href="https://google.com/"
                  className="text-sm cursor-pointer font-bold font-montserrat hover:bg-gray-700 px-3 py-1 rounded-md"
                >
                  ARCHIVE
                </a>
                <a
                  href="https://google.com/"
                  className="text-sm cursor-pointer font-bold font-montserrat hover:bg-gray-700 px-3 py-1 rounded-md"
                >
                  CONTACT
                </a>
              </div>

              {/* Log In */}
              <div className="flex items-center gap-2">
                <a
                  href="https://google.com/"
                  className="flex items-center gap-1 text-sm text-white font-montserrat hover:underline"
                >
                  <img src={login.src} alt="Login" className="w-5 h-5 filter invert" />
                  Log In
                </a>
              </div>
            </div>
          </div>

          <img
            src={image.src}
            alt="AMACSS Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
          />
        </div>
      )}
    </div>
  )
}
