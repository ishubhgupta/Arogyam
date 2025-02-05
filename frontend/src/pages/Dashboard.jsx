import React from 'react';
import { FaLeaf, FaUserMd, FaCalendarAlt, FaLink, FaNewspaper, FaSpa, FaHome } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const cards = [
    { icon: <FaLeaf />, title: "Seasonal Tips", desc: "Stay healthy this season with our expert tips." },
    { icon: <FaUserMd />, title: "Patient Summary", desc: "View your health summary and progress." },
    { icon: <FaCalendarAlt />, title: "Appointments", desc: "Manage your upcoming appointments." },
    { icon: <FaLink />, title: "Integration", desc: "Connect with other health services." },
    { icon: <FaNewspaper />, title: "Headlines", desc: "Latest health news and updates." },
    { icon: <FaSpa />, title: "Natural Therapy", desc: "Explore natural remedies and therapies." },
    { icon: <FaHome />, title: "Home Remedies", desc: "Simple home remedies for common ailments." }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to Arogyam</h1>
        <p className="header-subtitle">Your personal health dashboard</p>
      </header>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div className="dashboard-card" key={index}>
            <div className="card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;