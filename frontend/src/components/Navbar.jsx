import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Navbar.css'; // Optional: for styling
import logo from '../public/images/dashboard/Logo5.png'; // Path to your logo image

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <Link to="/" className="navbar-brand">
          <img src={logo} alt="Arogyam Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/features" className="nav-link">
          Features
        </Link>
        <Link to="/about" className="nav-link">
          About Us
        </Link>
        <Link to="/contact" className="nav-link">
          Contact Us
        </Link>
        <Link to="/signup" className="nav-link">
          Sign Up
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </div>
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          Menu
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <Link to="/features" className="nav-link">
              Features
            </Link>
            <Link to="/contact" className="nav-link">
              Contact Us
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;