"use client";
import { useState, useEffect } from 'react';
import MobileDashboard from './MobileDashboard';
import DesktopDashboard from './DesktopDashboard';

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);  
    };

    handleResize();  
    window.addEventListener('resize', handleResize);  
    return () => window.removeEventListener('resize', handleResize); 
  }, []);

  return isMobile ? <MobileDashboard /> : <DesktopDashboard />;
}
