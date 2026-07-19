import { FiMoon } from "react-icons/fi";

function HeaderRight() {
  return (
    <div className="header__right">
      <button
        type="button"
        className="theme-toggle"
        aria-label="Toggle Theme"
        title="Toggle Theme"
      >
        <FiMoon size={20} />
      </button>
    </div>
  );
}

export default HeaderRight;