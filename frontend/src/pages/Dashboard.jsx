import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

// Image Imports
import naturalIcon from "../public/images/dashboard/Protecting your health with natural remedies.png";
import homeRemediesIcon from "../public/images/dashboard/Home Solutions and Home Improvement.png";

// Component Imports
import Navbar from "../components/Navbar.jsx";
import WeatherTip from "../components/WeatherTip.jsx"; // new import

// Lottie Animation Imports
import Lottie from "lottie-react";
import UserProfile from "../public/images/UserProfile.json";
import GoogleFit from "../public/images/GoogleFit.json";
import Disease from "../public/images/Disease.json";
import Chatbot from "../public/images/Chatbot.json";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="grid-container">
          {/* Row 1 */}
          <div className="card yellow patient">
            <h3>Patient Summary</h3>
            <div className="Dashboard-Profile-lottieAnimation">
              <Lottie animationData={UserProfile} />
            </div>
          </div>

          <div className="card blue notifications">
            <h3>Notifications</h3>
          </div>

          <div
            className="card chatbot action"
            onClick={() => navigate("/chatbot")}
            style={{ cursor: "pointer" }}
          >
            <h3>Rantbot</h3>
            <div className="Dashboard-Chatbot-lottieAnimation">
              <Lottie animationData={Chatbot} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="card teal seasonal">
            <div className="seasonal-content">
              <div className="seasonal-text">
                <h3>Seasonal Tips</h3>
                <WeatherTip /> {/* integrated dynamic weather tip */}
              </div>
            </div>
          </div>

          <div className="google">
            <div className="google-content">
              <div className="google-text">
                <h3>Disease Prediction</h3>
              </div>
              <div className="Dashboard-Google-lottieAnimation">
                <Lottie animationData={GoogleFit} />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div
            className="card green natural"
            onClick={() => navigate("/natural-therapy")}
            style={{ cursor: "pointer" }}
          >
            <h3>Natural Therapy</h3>
            <img
              className="natural-icon"
              src={naturalIcon}
              alt="Natural Icon"
            />
          </div>

          <div
            className="card pink home"
            onClick={() => navigate("/google-fit")}
            style={{ cursor: "pointer" }}
          >
            <img
              className="home-remedies-icon"
              src={homeRemediesIcon}
              alt="Home Remedies Icon"
            />
            <h3>Google Fit Connect</h3>
          </div>

          <div className="card red disease">
            <div className="disease-text">
              <h3>Disease Prediction</h3>
            </div>
            <div className="Dashboard-Disease-lottieAnimation">
              <Lottie animationData={Disease} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
