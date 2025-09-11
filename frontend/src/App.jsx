import React, { useState , useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./pages/Navbar";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectRoute";
import LayoutWithNavbar from "./routes/LayoutWithNavbar";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

   // Load theme from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Whenever theme changes, save to localStorage
  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={darkMode ? "dark" : ""}>
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          {/* <Navbar darkMode={darkMode} setDarkMode={setDarkMode} /> */}
          <main className="max-w-7xl mx-auto p-0">
            <Routes>
             {/* Public routes without Navbar */}
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes with Navbar */}
            <Route element={<ProtectedRoute />}>
              <Route element={<LayoutWithNavbar darkMode={darkMode} setDarkMode={setDarkMode} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/payments" element={<Payments />} />
              </Route>
            </Route>
              <Route
                path="*"
                element={
                  <p className="text-center text-red-600 dark:text-red-400">
                    404 Not Found
                  </p>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}