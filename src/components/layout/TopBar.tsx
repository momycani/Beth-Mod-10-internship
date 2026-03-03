import { FaBars, FaTimes, FaSearch } from "react-icons/fa";

type TopBarProps = {
  onMenuClick: () => void;
  isMenuOpen: boolean;
};

export default function TopBar({ onMenuClick, isMenuOpen }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar__row">
        {/* SEARCH */}
        <form className="topbar__search" onSubmit={(e) => e.preventDefault()}>
          <div className="search-wrapper">
          <input className="topbar__input" type="search" placeholder="Search for books" />
          <button className="topbar__searchBtn" type="submit" aria-label="Search">
            <FaSearch />
          </button>
          </div>
        </form>

        {/* HAMBURGER */}
        <button
          type="button"
          className="hamburger"
          onClick={onMenuClick}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </div>
  );
}