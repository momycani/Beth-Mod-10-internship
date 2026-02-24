import { 
  FiHome,
  FiBookmark,
  FiSearch, 
  FiEdit,
  FiSettings,
  FiHelpCircle,
  FiLogOut
} from "react-icons/fi";
import { RiBallPenLine } from "react-icons/ri";

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
        <NavLink to="/for-you" className="sidebar__item">
          <FiHome size={18} />
          <span>For you</span>
        </NavLink>

        <NavLink to="/library" className="sidebar__item">
          <FiBookmark size={18} />
          <span>My Library</span>
        </NavLink>

        <NavLink to="/highlights" className="sidebar__item">
          <RiBallPenLine size={18} />
          <span>Highlights</span>
        </NavLink>

        <NavLink to="/search" className="sidebar__item">
          <FiSearch size={18} />
          <span>Search</span>
        </NavLink>
      </div>

      {/* Bottom Section */}
      <div className="sidebar__bottom">
        <NavLink to="/settings" className="sidebar__item">
          <FiSettings size={18} />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/support" className="sidebar__item">
          <FiHelpCircle size={18} />
          <span>Help & Support</span>
        </NavLink>

        <div className="sidebar__item">
          <FiLogOut size={18} />
          <span>Logout</span>
        </div>

      </div>
    </>
  );
}
