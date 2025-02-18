import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./VerticalNav.css";
import AccountOverlay from "./AccountOverlay.jsx";

const navItems = [
  { id: "profile", label: "Profile", icon: "icon-chat", url: "/user-profile" },
  { id: "dashboard", label: "Dashboard", icon: "icon-dashboard", url: "/dashboard" },
  { id: "rantbot", label: "RantBot", icon: "icon-chat", url: "/chatbot" },
  { id: "update", label: "User Info", icon: "icon-update", url: "/user-info" },
  // { id: "notification", label: "Notification", icon: "icon-notification", url: "/notification" },
  { id: "account", label: "Account", icon: "icon-account" },
];

const VerticalNav = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const handleItemClick = (item) => {
    if (item.id === "account") {
      setOverlayOpen(true);
    } else {
      window.location.href = item.url;
    }
  };

  return (
    <>
      <nav className="vertical-nav">
        <div className="logo">Arogyam</div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          Menu
        </button>
        <ul className={menuOpen ? "open" : ""}>
          {navItems.map((item) => (
            <li
              key={item.id}
              className={item.url === location.pathname ? "active" : ""}
              onClick={() => handleItemClick(item)}
            >
              <i className={item.icon} /> {item.label}
            </li>
          ))}
        </ul>
      </nav>
      {overlayOpen && (
        <AccountOverlay closeOverlay={() => setOverlayOpen(false)} />
      )}
    </>
  );
};

export default VerticalNav;