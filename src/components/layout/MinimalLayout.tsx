import React from "react";
import { Outlet } from "react-router-dom";

export default function MinimalLayout() {
  return (
    <div className="minimal-layout">
      <Outlet />
    </div>
  );
}