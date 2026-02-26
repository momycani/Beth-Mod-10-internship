import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "../../styles/style.css";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const isPlayer = pathname.startsWith("/player/");

 return (
  <div className={`app-layout ${isPlayer ? "is-player" : ""}`}>
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    <div className="main-area">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  </div>
);
}