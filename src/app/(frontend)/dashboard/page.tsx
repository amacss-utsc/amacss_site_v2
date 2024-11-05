"use client";
import { useEffect, useState } from 'react';
import Lottie from "react-lottie"; 
import animationData from '../../assets/mobile.json';  
import styles from './dashboard.module.css'; 
import image from "../../assets/amacss_logo.jpg";
import menu from "../../assets/menu.png";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export default function Dashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    useEffect(() => {
      setIsClient(true);
      window.scrollTo(0, 105);

      const handleScroll = () => {
        const scrollTop = window.scrollY;  
        const windowHeight = window.innerHeight;  
        const documentHeight = document.documentElement.scrollHeight;  

        if (scrollTop + windowHeight >= documentHeight) {
          setTimeout(() => {
            setIsMenuOpen(true);
        }, 100);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll); // Clean up event listener
      };
      
    }, []);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

  
    return (
      <div className={styles.container}>
        {isClient && (
          <div className={styles.animationWrapper}>
            <Lottie options={defaultOptions} height={window.innerHeight} width={window.innerWidth} />
            <img 
              src={menu.src}  
              alt="menu"
              className="absolute top-4 right-2 w-12 h-12 transform"
              style={{ filter: 'invert(1) brightness(2)' }}
              onClick={toggleMenu}
            />

            {isMenuOpen && (
              <div className={`fixed top-0 right-0 w-64 h-full text-white shadow-lg transition-transform duration-10000 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ backgroundColor: '#1E1E1E', zIndex: 11 }}>
                
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <button onClick={toggleMenu} className="text-lg font-montserrat font-bold"> > Close</button>
                </div>
                <ul className="mt-4 p-4">
                <li className="py-2 text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold">EVENTS</li>
                <li className="py-2 text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold">OUR TEAM</li>
                <li className="py-2 text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold">ARCHIVE</li>
                <li className="py-2 text-xl hover:bg-gray-700 cursor-pointer font-montserrat font-bold">CONTACT</li>
                </ul>
              </div>
            )} 

            <img 
              src={image.src}  
              alt="AMACSS Logo"
              className={styles.imageOverlay2}  
            />
          </div>
        )}
      </div>
    );
  }