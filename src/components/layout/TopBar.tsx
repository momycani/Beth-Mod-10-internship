import React from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

type TopBarProps = {
  onMenuClick: () => void;
  isMenuOpen: boolean;
};

export default function TopBar({ onMenuClick, isMenuOpen }: TopBarProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const SearchIcon = FaSearch as React.ElementType;
  const TimesIcon = FaTimes as React.ElementType;
  const BarsIcon = FaBars as React.ElementType;

  return (
    <div className="topbar">
      <div className="topbar__row">        
        <form className="topbar__search" onSubmit={(e) => {
          e.preventDefault();
          const trimmed = search.trim();
          if (!trimmed) return;

          navigate({
            pathname: "/search",
            search: `?${createSearchParams({ q: trimmed })}`,
          });
          setSearch("");
        }}>
          <div className="search-wrapper">
          <input className="topbar__input" type="search" placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <button className="topbar__searchBtn" type="submit" aria-label="Search">
            <SearchIcon />
          </button>
          </div>
        </form>
       
        <button
          type="button"
          className="hamburger"
          onClick={onMenuClick}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}>
          {isMenuOpen ? <TimesIcon /> : <BarsIcon />}
        </button>
      </div>
    </div>
  );
}