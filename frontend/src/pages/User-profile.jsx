import React, { useState, useEffect } from "react";
import "./User-profile.css";
import VerticalNav from "../components/VerticalNav.jsx";
import HumanBodyViewer from "../components/HumanBodyViewer.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/patients/profile", { withCredentials: true });
        setUserData(response.data.patient);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 18) greeting = "Good Afternoon";
  else if (currentHour >= 18) greeting = "Good Evening";

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;
  if (!userData) return <p>No user data available.</p>;

  return (
    <div className="user-profile-container">
      <VerticalNav />
      <div className="user-main">
        <header className="user-header">
          <div className="greeting-info">
            <h2>{greeting},</h2>
            <strong>{userData.first_name} {userData.last_name}</strong>
          </div>
        </header>

        <div className="user-details">
          <div className="info-item"><span>{userData.age || "N/A"}</span><p>Years Old</p></div>
          <div className="info-item"><span>{userData.height || "N/A"}</span><p>Height, cm</p></div>
          <div className="info-item"><span>{userData.weight || "N/A"}</span><p>Weight, kg</p></div>
          <div className="info-item"><span>{userData.blood_type || "N/A"}</span><p>Blood Type</p></div>
        </div>

        {/* Google Fit Data Section */}
        <div className="health-metrics-row">
          <div className="metric-card"><p>Steps Walked</p><h2>{userData.googleFitData?.stepsWalked || "N/A"}</h2></div>
          <div className="metric-card"><p>Calories Burned</p><h2>{userData.googleFitData?.caloriesBurned || "N/A"} kcal</h2></div>
          <div className="metric-card"><p>Distance Walked</p><h2>{userData.googleFitData?.distanceWalked || "N/A"} meters</h2></div>
          <div className="metric-card"><p>Heart Rate</p><h2>{userData.googleFitData?.heartRate || "N/A"} BPM</h2></div>
          <div className="metric-card"><p>Pulse Rate</p><h2>{userData.googleFitData?.pulseRate || "N/A"} BPM</h2></div>
          <div className="metric-card"><p>Blood Oxygen (SpO2)</p><h2>{userData.googleFitData?.spo2 || "N/A"} %</h2></div>
          <div className="metric-card">
            <p>Blood Pressure</p>
            <h2>
              {userData.googleFitData?.bloodPressure?.systolic || "N/A"}/
              {userData.googleFitData?.bloodPressure?.diastolic || "N/A"} mmHg
            </h2>
          </div>
        </div>

        <div className="heart-rate">
          <h3>Heart Rate Over Time</h3>
          <div className="heart-rate-chart">
            {/* Heart Rate Graph Placeholder */}
          </div>
        </div>
      </div>

      <div className="body-card">
        <ErrorBoundary>
          <HumanBodyViewer />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default UserProfile;
