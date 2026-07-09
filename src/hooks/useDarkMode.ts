import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('future_fund_theme');
      return savedTheme === 'dark' || !savedTheme; // Default to dark first design
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('future_fund_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('future_fund_theme', 'light');
    }
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
}
export default useDarkMode;
