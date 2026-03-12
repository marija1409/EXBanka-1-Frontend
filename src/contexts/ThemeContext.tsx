import { createContext, useContext, useEffect, useState } from 'react'

// Note: toggling .dark on <html> activates the CSS variable block in index.css.
// The Tailwind @custom-variant dark (&:is(.dark *)) targets children of .dark for utility classes.
// Both are intentional and correct.

interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark')

  // Apply/remove .dark class on <html> whenever isDark changes (including initial mount)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Only write to localStorage when the user explicitly toggles (not on initial mount)
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- context files intentionally export both provider and hook
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
