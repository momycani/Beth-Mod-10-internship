import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiBookmark, FiSearch, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { RiBallPenLine, RiFontSize } from "react-icons/ri";

import { NavLink } from "react-router-dom";
import "../../styles/style.css";

const FONT_SIZES = [14, 16, 18, 20] as const;
type FontSize = (typeof FONT_SIZES)[number];

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { pathname } = useLocation();
  const isPlayerPage = pathname.startsWith("/player");

  const [fontSize, setFontSize] = React.useState<FontSize>(() => {
    const saved = Number(localStorage.getItem("playerFontSize"));
    return (FONT_SIZES as readonly number[]).includes(saved)
      ? (saved as FontSize)
      : 16;
  });

  const navigate = useNavigate();

  const handleLogout = async () => {  
    await signOut(auth);

  localStorage.removeItem("isPremium");
  localStorage.removeItem("premiumPlan");
  localStorage.removeItem("postAuthRedirect");
  localStorage.removeItem("isGuest");

  // send user to Home
  navigate("/", { replace: true });
  }


  React.useEffect(() => {
    localStorage.setItem("playerFontSize", String(fontSize));
  }, [fontSize]);

  React.useEffect(() => {
    if (!isPlayerPage) return;

    document.documentElement.style.setProperty(
      "--player-font-size",
      `${fontSize}px`
    );

    return () => {
      document.documentElement.style.removeProperty("--player-font-size");
    };
  }, [fontSize, isPlayerPage]);

  return (
    <>
      {/* Overlay (only visible on mobile when open) */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar__logo">
          <figure className="sidebar__img--mask">
            <img className="sidebar__img" src="/assets/logo.png" alt="logo" />
          </figure>
        </div>

        {/* Top Navigation */}
        <div className="sidebar__top">
          <NavLink to="/foryou" className="sidebar__item">
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

          {/* ✅ Player-only font size controls go HERE (inside the sidebar) */}
          {isPlayerPage && (
            <div className="sidebar-font">
              <div className="sidebar-font__controls" role="group" aria-label="Font size">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    style={{ fontSize: size }}
                    type="button"
                    className={`sidebar-font__btn ${fontSize === size ? "active" : ""}`}
                    onClick={() => setFontSize(size)}
                    aria-pressed={fontSize === size}
                    aria-label={`Set font size to ${size}px`}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </div>
          )}
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

          <button type="button" onClick={handleLogout} className="sidebar__item">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}