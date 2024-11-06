'use client'
import { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import animationData from '../../assets/desktop.json'
import styles from './dashboard.module.css'
import image from '../../assets/amacss-logo.png'

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
    <div className={styles.container}>
      {isClient && (
        <div className={styles.animationWrapper}>
          <Lottie options={defaultOptions} height={window.innerHeight} width={window.innerWidth} />

          <div
            className={`fixed top-0 left-0 w-auto h-auto text-white shadow-lg transition-transform duration-300 ease-out transform`}
            style={{ backgroundColor: '#1E1E1E', zIndex: 11, padding: '8px 12px' }}
          >
            <div className="flex gap-4">
              <span className="text-xl cursor-pointer font-montserrat font-bold hover:bg-gray-700 p-2">
                EVENTS
              </span>
              <span className="text-xl cursor-pointer font-montserrat font-bold hover:bg-gray-700 p-2">
                OUR TEAM
              </span>
              <span className="text-xl cursor-pointer font-montserrat font-bold hover:bg-gray-700 p-2">
                ARCHIVE
              </span>
              <span className="text-xl cursor-pointer font-montserrat font-bold hover:bg-gray-700 p-2">
                CONTACT
              </span>
            </div>
          </div>

          <img src={image.src} alt="AMACSS Logo" className={styles.imageOverlay2} />
        </div>
      )}
    </div>
  )
}
