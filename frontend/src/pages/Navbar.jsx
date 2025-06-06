import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ currentPage }) => {
  const navigate = useNavigate();
  const [fading, setFading] = useState(false);

  const handleLogout = () => {
    setFading(true);
    setTimeout(() => {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
    }, 800);
  };

  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <>
      <div className="navbar">
        <span className="homelinks">
          <Link to="/">Automation Dashboard</Link>
        </span>
        <span className="navlinks">
          <Link to="/" className={currentPage === "home" ? "active" : ""}>
            Home
          </Link>
          <Link to="/directory" className={currentPage === "directory" ? "active" : ""}>
            Directory
          </Link>
          <Link to="/applications" className={currentPage === "applications" ? "active" : ""}>
            Applications
          </Link>
          {!isLoggedIn ? (
            <Link to="/login" className={["login", "signup"].includes(currentPage) ? "active" : ""}>
              Login
            </Link>
          ) : (
            <Link onClick={handleLogout}>Logout</Link>
          )}
        </span>
      </div>

      {/* 🔥 Fade animation overlay */}
      <div className={`fade-screen ${fading ? "active" : ""}`} />
    </>
  );
};

export default Navbar;
