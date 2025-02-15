import React from "react";
import "./GoogleFit.css";
import Navbar from "../components/Navbar";

const GoogleFit = () => {
  // Extended static dummy data; replace with dynamic data later.
  const data = {
    stepsWalked: 1234,
    caloriesBurned: 250,
    distanceWalked: 1.2,
    heartRate: 72,
    pulseRate: 70,
    spo2: 98,
    bloodPressure: { systolic: 120, diastolic: 80 },
    activeMinutes: 45,
    floorsClimbed: 10,
    sleepDuration: 7.5,
    bodyFatPercentage: 18,
    bodyMassIndex: 22.5,
    waterIntake: 2.0,
    activeEnergy: 300,
    exerciseMinutes: 35,
  };

  // Extended metrics array with extra dummy metrics
  const metrics = [
    { key: "stepsWalked", label: "Steps Walked", unit: "" },
    { key: "caloriesBurned", label: "Calories Burned", unit: "kcal" },
    { key: "distanceWalked", label: "Distance Walked", unit: "meters" },
    { key: "heartRate", label: "Heart Rate", unit: "BPM" },
    { key: "pulseRate", label: "Pulse Rate", unit: "BPM" },
    { key: "spo2", label: "Blood Oxygen (SpO2)", unit: "%" },
    { key: "bloodPressure", label: "Blood Pressure", unit: "mmHg", isBP: true },
    { key: "activeMinutes", label: "Active Minutes", unit: "min" },
    { key: "floorsClimbed", label: "Floors Climbed", unit: "" },
    { key: "sleepDuration", label: "Sleep Duration", unit: "hrs" },
    { key: "bodyFatPercentage", label: "Body Fat", unit: "%" },
    { key: "bodyMassIndex", label: "BMI", unit: "" },
    { key: "waterIntake", label: "Water Intake", unit: "L" },
    { key: "activeEnergy", label: "Active Energy Burned", unit: "kcal" },
    { key: "exerciseMinutes", label: "Exercise Minutes", unit: "min" },
  ];

  return (
    <>
      <Navbar />
      <div className="google-fit-page">
        <header className="google-fit-header">
          <h1>Google Fit Dashboard</h1>
          <p className="subtitle">Track your health and fitness metrics</p>
        </header>

        <div className="metrics-container">
          <div className="metrics-section">
            <h2>Activity Metrics</h2>
            <div className="metrics-grid">
              {metrics.slice(0, 5).map(({ key, label, unit, isBP }) => {
                let value;
                if (isBP) {
                  const systolic = data?.bloodPressure?.systolic;
                  const diastolic = data?.bloodPressure?.diastolic;
                  value =
                    systolic && diastolic ? `${systolic}/${diastolic}` : "-";
                } else {
                  value = data?.[key] || "-";
                }
                return (
                  <div className="metric-card" key={key}>
                    <p>{label}</p>
                    <h2>
                      {value} {value !== "-" && unit && <small>{unit}</small>}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="metrics-section">
            <h2>Vital Signs</h2>
            <div className="metrics-grid">
              {metrics.slice(5, 10).map(({ key, label, unit, isBP }) => {
                let value;
                if (isBP) {
                  const systolic = data?.bloodPressure?.systolic;
                  const diastolic = data?.bloodPressure?.diastolic;
                  value =
                    systolic && diastolic ? `${systolic}/${diastolic}` : "-";
                } else {
                  value = data?.[key] || "-";
                }
                return (
                  <div className="metric-card" key={key}>
                    <p>{label}</p>
                    <h2>
                      {value} {value !== "-" && unit && <small>{unit}</small>}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="metrics-section">
            <h2>Body Measurements</h2>
            <div className="metrics-grid">
              {metrics.slice(10).map(({ key, label, unit, isBP }) => {
                let value;
                if (isBP) {
                  const systolic = data?.bloodPressure?.systolic;
                  const diastolic = data?.bloodPressure?.diastolic;
                  value =
                    systolic && diastolic ? `${systolic}/${diastolic}` : "-";
                } else {
                  value = data?.[key] || "-";
                }
                return (
                  <div className="metric-card" key={key}>
                    <p>{label}</p>
                    <h2>
                      {value} {value !== "-" && unit && <small>{unit}</small>}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleFit;
