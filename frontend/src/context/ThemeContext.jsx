import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './theme-context.js'


export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const initialTheme = document.documentElement.dataset.theme
    return initialTheme === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    const themeColor = theme === 'light' ? '#f8fafc' : '#030712'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.backgroundColor = themeColor
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)

    try {
      localStorage.setItem('harsh-theme', theme)
    } catch {
      // The selected theme still applies when browser storage is unavailable.
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
