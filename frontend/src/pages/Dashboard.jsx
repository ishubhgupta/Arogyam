import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <button className="menu-btn">☰</button>
      </div>

      <div className="grid-container">
        {/* Patient Summary: spans cells 1,2,7,8 */}
        <div className="card yellow patient">
          <h3>Patient Summary</h3>
          <button className="edit-btn">Edit</button>
        </div>

        {/* Seasonal Tips: occupies cells 3,4,5 */}
        <div className="card blue seasonal">
          <h3>Seasonal Tips</h3>
          <p>Stay healthy this season with our expert tips.</p>
        </div>

        {/* Actions: occupies cell 6 */}
        <div className="card actions action">
          <h3>Actions</h3>
          <div className="button-grid">
            <button>Btn 1</button>
            <button>Btn 2</button>
            <button>Btn 3</button>
            <button>Btn 4</button>
          </div>
        </div>

        {/* Appointment Deadlines: occupies cell 9 */}
        <div className="card teal appointment">
          <h3>Appointment Deadlines</h3>
          <p>Manage timely appointments.</p>
        </div>

        {/* Google Fit Integration: occupies cells 10,11,12 */}
        <div className="card white google">
          <h3>Google Fit Integration</h3>
          <p>Connect your Google Fit data.</p>
        </div>

        {/* Natural Therapy: occupies cells 13,14 */}
        <div className="card green natural">
          <h3>Natural Therapy</h3>
          <p>Explore natural healing methods.</p>
        </div>

        {/* Home Remedies: occupies cells 15,16,17,18 */}
        <div className="card pink home">
          <h3>Home Remedies</h3>
          <p>Discover simple home remedies.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;