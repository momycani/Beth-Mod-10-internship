import { FaSearch } from "react-icons/fa";
import "../../styles/style.css";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search for books"
          className="search-input" />
        <div className="search-divider" />
        <button className="search-button">
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

