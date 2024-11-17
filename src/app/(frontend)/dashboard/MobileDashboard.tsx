'use client'
import { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import animationData from '../../assets/mobile.json'
import image from '../../assets/amacss-logo.png'
import login from '../../assets/login.png'
import menu from '../../assets/menu.png'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

export default function MobileDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    window.scrollTo(0, 105)

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight) {
        setTimeout(() => {
          setIsMenuOpen(true)
        }, 100)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full relative bg-[#1E1E1E]">
      {isClient && (
        <div className="relative w-full h-full">
          <Lottie options={defaultOptions} height={window.innerHeight} width={window.innerWidth} />
          <img
            src={menu.src}
            alt="menu"
            className="absolute top-4 right-2 w-12 h-12 transform"
            style={{ filter: 'invert(1) brightness(2)' }}
            onClick={toggleMenu}
          />

          {isMenuOpen && (
            <div
              className={`fixed top-0 right-0 w-64 h-full text-white shadow-lg transition-transform duration-10000 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ backgroundColor: '#1E1E1E', zIndex: 11 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <button onClick={toggleMenu} className="text-lg font-montserrat font-bold">
                  {' '}
                  {`>`} Close
                </button>
              </div>
              <ul className="mt-4 p-4">
                <li className="py-2">
                  <a
                    href="https://google.com/"
                    className="text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold block"
                  >
                    EVENTS
                  </a>
                </li>
                <li className="py-2">
                  <a
                    href="https://google.com/"
                    className="text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold block"
                  >
                    OUR TEAM
                  </a>
                </li>
                <li className="py-2">
                  <a
                    href="https://google.com/"
                    className="text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold block"
                  >
                    ARCHIVE
                  </a>
                </li>
                <li className="py-2">
                  <a
                    href="https://google.com/"
                    className="text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold block"
                  >
                    CONTACT
                  </a>
                </li>
              </ul>

              <div className="absolute bottom-4 left-4">
                <a
                  href="https://google.com/"
                  className="flex items-center gap-2 text-lg text-white font-montserrat hover:underline"
                >
                  <img src={login.src} alt="Login" className="w-6 h-6 filter invert" />
                  Log In
                </a>
              </div>
            </div>
          )}

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
