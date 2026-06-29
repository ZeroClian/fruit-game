import { useState, useEffect } from 'react';

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 480;
  const isTablet = windowSize.width >= 480 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  // Cell size based on screen width (optimized for 10x10 matrix)
  const cellSize = isMobile ? 24 : isTablet ? 30 : 36;

  return { ...windowSize, isMobile, isTablet, isDesktop, cellSize };
}
