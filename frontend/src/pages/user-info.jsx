import React from "react";
import VerticalNav from "../components/VerticalNav.jsx";
import UserDetailsForm from "../components/UserDetailsForm.jsx";
import "../pages/user-info.css"; // new import for container styling

const UserInfo = () => {
  return (
    <div className="user-profile-container">
      {/* Left-side Navigation */}
      <VerticalNav />
      {/* Right-side User Info Content */}
      <div className="user-main">
        <header className="user-header">
          <h2>User Info</h2>
        </header>
        <div className="user-details">
          yaha question answer dalna hai
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
