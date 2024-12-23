// LawyerDashboard.jsx
import React, { useState } from "react";
import { FileText, Search, Clock } from "lucide-react";
import "./PoliceDashboard.css";
import { useNavigate } from "react-router-dom";
import GeminiChatbox from "../../Home/GeminiChatbox"
const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const handleCardClick = (route) => {
    // Add your navigation logic here
    navigate(route);
    console.log(`Navigating to ${route}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Police Dashboard</h1>

      <div className="dashboard-cards">
        <div
          className="dashboard-card"
          onClick={() => handleCardClick("/Police-dashboard/create")}
        >
          <div className="card-icon">
            <FileText size={32} />
          </div>
          <h2>Charge sheet form</h2>
          <p>Submit new Charge sheet and track their status</p>
        </div>

        {/* <div
          className="dashboard-card"
          onClick={() => handleCardClick("/Police-dashboard/list")}
        >
          <div className="card-icon">
            <Clock size={32} />
          </div>
          <h2>List charge sheet</h2>
          <p>List all the charge sheet filed</p>
        </div> */}
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

export default PoliceDashboard;
