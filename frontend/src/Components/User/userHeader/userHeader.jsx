// Header.jsx
import React, { useEffect, useState } from 'react';
import { User, LogOut,ArrowBigLeft  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axios';
import './UserHeader.css';

const UserHeader = () => {
  const [UserDetails, setUserdetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserdetails = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/users/me');
        console.log(response.data);
        setUserdetails(response.data);
      } catch (error) {
        console.error('Error fetching judge details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserdetails();
  }, []);

  const handleLogout = () => {
    console.log("Logging out")
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
                  <span className="name">Hello : {UserDetails?.first_name || 'User'}</span>
                  <span className="role">users</span>
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
              <button 
                className="logout-button" 
                onClick={() => navigate(-1)} 
                title="Logout"
              >
                <ArrowBigLeft size={20} />
                <span>Back</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;