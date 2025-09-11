// LayoutWithNavbar.jsx
import React from "react";
import Navbar from "../pages/Navbar";
import { Outlet } from "react-router-dom";

export default function LayoutWithNavbar({ darkMode, setDarkMode }) {
  return (
    <div>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
