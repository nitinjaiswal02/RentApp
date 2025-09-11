import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-semibold transition ${
      isActive
        ? "bg-blue-600 text-white dark:bg-blue-500"
        : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          RentApp
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <NavLink to="/properties" className={navLinkClass}>
            Properties
          </NavLink>
          <NavLink to="/tenants" className={navLinkClass}>
            Tenants
          </NavLink>
          <NavLink to="/payments" className={navLinkClass}>
            Payments
          </NavLink>
        </div>

        {/* Theme Toggle + Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 border rounded text-sm dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1 border rounded text-sm text-red-600 border-red-600 hover:bg-red-100 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
