// Header.jsx
import React, { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axios';
import './JudgeHeader.css';

const JudgeHeader = () => {
  const [judgeDetails, setJudgeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJudgeDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/judge/me');
        setJudgeDetails(response.data);
      } catch (error) {
        console.error('Error fetching judge details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgeDetails();
  }, []);

  const handleLogout = () => {
    // Clear all authentication-related items from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    
    // Navigate to login page
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Bail Reckoner</h1>
        </div>
        <div className="profile-section">
          {loading ? (
            <div className="profile-skeleton" />
          ) : (
            <>
              <div className="profile">
                <div className="profile-info">
                  <span className="name">{judgeDetails?.name || 'Judge'}</span>
                  <span className="role">Judicial Officer</span>
                </div>
                <div className="profile-icon">
                  <User size={24} />
                </div>
              </div>
              <button 
                className="logout-button" 
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default JudgeHeader;