import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TherapyNavbar.css';
import Arogyam from '../public/images/dashboard/Logo5.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const TherapyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div 
        className={`hamburger-menu ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <nav className={`vertical-navbar ${isOpen ? 'active' : ''}`}>
        <div className="navbar-logo">
          <img src={Arogyam} alt="Logo" className="logo" />
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/natural-therapy" className="navbar-link" onClick={toggleMenu}>
              Natural Therapy
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/disease-prediction" className="navbar-link" onClick={toggleMenu}>
              Disease Prediction
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/chatbot" className="navbar-link" onClick={toggleMenu}>
              Chat with Rantbot
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default TherapyNavbar;