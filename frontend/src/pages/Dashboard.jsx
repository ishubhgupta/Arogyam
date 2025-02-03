import React from 'react';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      <div className="dashboard-grid">
        {/* Seasonal Tips */}
        <div className="dashboard-card">
          <h2>Seasonal Tips</h2>
          <p>Stay healthy this season with our expert tips.</p>
        </div>

        {/* Patient Summary */}
        <div className="dashboard-card">
          <h2>Patient Summary</h2>
          <p>View your health summary and progress.</p>
        </div>

        {/* Appointments */}
        <div className="dashboard-card">
          <h2>Appointments</h2>
          <p>Manage your upcoming appointments.</p>
        </div>

        {/* Integration */}
        <div className="dashboard-card">
          <h2>Integration</h2>
          <p>Connect with other health services.</p>
        </div>

        {/* Headlines */}
        <div className="dashboard-card">
          <h2>Headlines</h2>
          <p>Latest health news and updates.</p>
        </div>

        {/* Natural Therapy */}
        <div className="dashboard-card">
          <h2>Natural Therapy</h2>
          <p>Explore natural remedies and therapies.</p>
        </div>

        {/* Home Remedies */}
        <div className="dashboard-card">
          <h2>Home Remedies</h2>
          <p>Simple home remedies for common ailments.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;