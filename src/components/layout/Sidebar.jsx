import { 
  FaHome,
  FaBookmark,
  FaPen,
  FaSearch,
  FaCog,
  FaQuestionCircle,
  FaSignInAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import "../../styles/style.css";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay (only visible on mobile when open) */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <div className={`sidebar ${isOpen ? "open" : ""}`}>

        {/* Logo */}
        <div className="sidebar__logo">
          <figure className="sidebar__img--mask">
            <img className="sidebar__img" src="/assets/logo.png" alt="logo" />
          </figure>
        </div>

        {/* Top Navigation */}
        <div className="sidebar__top">
          <NavLink to="/for-you" className="sidebar__item" onClick={onClose}>
            <FaHome />
            <span>For you</span>
          </NavLink>

          <NavLink to="/library" className="sidebar__item" onClick={onClose}>
            <FaBookmark />
            <span>My Library</span>
          </NavLink>

          <NavLink to="/highlights" className="sidebar__item" onClick={onClose}>
            <FaPen />
            <span>Highlights</span>
          </NavLink>

          <NavLink to="/search" className="sidebar__item" onClick={onClose}>
            <FaSearch />
            <span>Search</span>
          </NavLink>
        </div>

        {/* Bottom Section */}
        <div className="sidebar__bottom">
          <NavLink to="/settings" className="sidebar__item" onClick={onClose}>
            <FaCog />
            <span>Settings</span>
          </NavLink>

          <NavLink to="/support" className="sidebar__item" onClick={onClose}>
            <FaQuestionCircle />
            <span>Help & Support</span>
          </NavLink>

          <div className="sidebar__item">
            <FaSignInAlt />
            <span>Login</span>
          </div>
        </div>

      </div>
    </>
  );
}
