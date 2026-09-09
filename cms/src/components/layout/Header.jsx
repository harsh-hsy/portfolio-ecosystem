import HeaderRight from './HeaderRight'

function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__left" />
      <HeaderRight theme={theme} onToggleTheme={onToggleTheme} />
    </header>
  )
}

export default Header
