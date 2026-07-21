import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <HeaderLeft />
      <HeaderRight theme={theme} onToggleTheme={onToggleTheme} />
    </header>
  );
}

export default Header;
