import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <main className="public-layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}