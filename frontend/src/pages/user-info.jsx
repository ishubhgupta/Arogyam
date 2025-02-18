import React from "react";
import VerticalNav from "../components/VerticalNav.jsx";
import UserDetailsForm from "../components/UserDetailsForm.jsx";
import "./user-info.module.css";

const UserInfo = () => {
  return (
    <div className="user-profile-container">
      <VerticalNav />
      <div className="user-main">
        <div className="user-header">
          <h2>User Information</h2>
          <p>Manage your personal and health information</p>
        </div>
        <div className="user-details">
          <UserDetailsForm />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;