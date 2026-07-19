import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../hooks/useTheme.js'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      {isDark ? <FiSun /> : <FiMoon />}
    </button>
  )
}
