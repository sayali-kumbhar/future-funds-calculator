import { useState, useEffect } from 'react';

export function useScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (y: number = 0, smooth: boolean = true) => {
    window.scrollTo({
      top: y,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  return { scrollY, scrollTo };
}
