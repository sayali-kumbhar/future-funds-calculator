import { useDarkMode } from './useDarkMode';

export function useTheme() {
  const [darkMode, setDarkMode] = useDarkMode();
  return {
    darkMode,
    setDarkMode,
    isDark: darkMode,
    toggleTheme: () => setDarkMode(!darkMode),
  };
}
