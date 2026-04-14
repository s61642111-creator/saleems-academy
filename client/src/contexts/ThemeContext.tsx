import { createContext, useContext, useEffect, useState } from 'react';
import { storageTheme } from '@/lib/storage';

type Theme = 'light' | 'dark';
interface ThemeContextType { theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', setTheme: () => {}, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(storageTheme.get);
  const setTheme = (t: Theme) => { setThemeState(t); storageTheme.set(t); };
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() { return useContext(ThemeContext); }