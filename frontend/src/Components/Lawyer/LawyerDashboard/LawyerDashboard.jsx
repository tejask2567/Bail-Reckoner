// LawyerDashboard.jsx
import React,{useState} from "react";
import { FileText, Search, Clock } from "lucide-react";
import "./LawyerDashboard.css";
import { useNavigate } from "react-router-dom";
import GeminiChatbox from "../../Home/GeminiChatbox"
const LawyerDashboard = () => {
  const navigate = useNavigate();
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const handleCardClick = (route) => {
    // Add your navigation logic here
    navigate(route);
    console.log(`Navigating to ${route}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Lawyer Dashboard</h1>

      <div className="dashboard-cards">
        <div
          className="dashboard-card"
          onClick={() => handleCardClick("/lawyer-dashboard/create")}
        >
          <div className="card-icon">
            <FileText size={32} />
          </div>
          <h2>Bail Application Form</h2>
          <p>Submit new bail applications and track their status</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => handleCardClick("/lawyer-dashboard/past")}
        >
          <div className="card-icon">
            <Search size={32} />
          </div>
          <h2>Past Case Review</h2>
          <p>Access and review historical case records</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => handleCardClick("/lawyer-dashboard/status")}
        >
          <div className="card-icon">
            <Clock size={32} />
          </div>
          <h2>Current Cases Status</h2>
          <p>Monitor your active cases and their progress</p>
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

export default LawyerDashboard;
