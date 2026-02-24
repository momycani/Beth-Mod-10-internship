// TopBar.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaBars } from "react-icons/fa";

export default function TopBar({ onHamburger }: { onHamburger?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSearchPage = location.pathname === "/search";
  const params = new URLSearchParams(location.search);
  const qFromUrl = params.get("q") ?? "";

  const [q, setQ] = useState("");

  // ✅ only sync from URL on the Search page
  useEffect(() => {
    if (isSearchPage) setQ(qFromUrl);
  }, [isSearchPage, qFromUrl]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();

    // ✅ always go to /search and set q
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  const clear = () => {
    setQ("");
    navigate("/search");
  };

  return (
    <div className="topbar">
      <button className="hamburger" onClick={onHamburger} aria-label="Open menu">
        <FaBars />
      </button>

      <form className="search-wrapper" onSubmit={submit}>
        <input
          className="search-input"
          placeholder="Search for books"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="search-divider" />

        {q.trim() ? (
          <button
            type="button"
            className="search-button"
            aria-label="Clear search"
            onClick={clear}
          >
            <FaTimes />
          </button>
        ) : (
          <button type="submit" className="search-button" aria-label="Search">
            <FaSearch />
          </button>
        )}
      </form>
    </div>
  );
}
