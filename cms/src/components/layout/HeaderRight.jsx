import { FiMoon, FiSun } from "react-icons/fi";

function HeaderRight({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <div className="header__right">
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
        aria-pressed={isDark}
      >
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    </div>
  );
}

export default HeaderRight;
