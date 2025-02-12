import React from 'react';
import './TherapyNavbar.css';
import Arogyam from '../public/images/dashboard/Logo5.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const VerticalNavbar = () => {
  return (
    <nav className="vertical-navbar">
      <div className="navbar-logo">
        <img src={Arogyam} alt="Logo" className="logo" />
      </div>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <a href="/" className="navbar-link">
          <FontAwesomeIcon icon={faHouseUser} />
          </a>
        </li>
        <li className="navbar-item">
          <a href="/dashboard" className="navbar-link">
          <FontAwesomeIcon icon={faHouseUser} />
          </a>
        </li>
        <li className="navbar-item">
          <a href="/rantbot" className="navbar-link">
          <FontAwesomeIcon icon={faHouseUser} />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default VerticalNavbar;