// LawyerDashboard.jsx
import React, { useState } from "react";
import { FileText, Search, Clock } from "lucide-react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
import GeminiChatbox from "../../Home/GeminiChatbox";
const UserDashboard = () => {
  const navigate = useNavigate();
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const handleCardClick = (route) => {
    // Add your navigation logic here
    navigate(route);
    console.log(`Navigating to ${route}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>

      <div className="dashboard-cards">
        <div
          className="dashboard-card"
          onClick={() => handleCardClick("/dashboard/search")}
        >
          <div className="card-icon">
            <FileText size={32} />
          </div>
          <h2>Search Lawyer</h2>
          <p>Search for the most suitable Lawyer in your locality</p>
        </div>
        <div
          className="dashboard-card"
          onClick={() => handleCardClick("/dashboard/cases")}
        >
          <div className="card-icon">
            <Clock size={32} />
          </div>
          <h2>Search Case status</h2>
          <p>Get to know the status of your bail</p>
        </div>
      </div>
      <div
        className={`chatbox-container ${isChatboxOpen ? "block" : "hidden"}`}
      >
        <div className="fixed bottom-24 left-8 w-96 z-[2001]">
          <GeminiChatbox />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
