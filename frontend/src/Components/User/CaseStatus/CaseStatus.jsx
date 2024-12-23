import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import "./CaseStatus.css";

const CaseStatus = () => {
  const [caseId, setCaseId] = useState("");
  const [searchedCaseId, setSearchedCaseId] = useState("");
  const [bailData, setBailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBailStatus = async () => {
      if (!searchedCaseId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `/api/v1/bail/case/${searchedCaseId}`
        );
        console.log(response.data);
        setBailData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch bail status");
        setBailData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBailStatus();
  }, [searchedCaseId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedCaseId(caseId.trim());
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="case-status-wrapper">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="Enter Case ID"
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="case-status-container loading">Loading...</div>
      )}

      {error && (
        <div className="case-status-container error">
          <p className="error-message">{error}</p>
        </div>
      )}

      {!loading && !error && bailData && (
        <div className="case-status-container">
          <h2 className="case-status-title">Bail Application Details</h2>
          <div className="case-status-info">
            <div className="status-item">
              <span className="label">Case Status:</span>
              <span className={`value status-${bailData.status.toLowerCase()}`}>
                {bailData.status.toUpperCase()}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Applicant Name:</span>
              <span className="value">{bailData.plaintiff}</span>
            </div>
            <div className="status-item">
              <span className="label">Bail Type:</span>
              <span className="value">{bailData.bail_type}</span>
            </div>
            <div className="status-item">
              <span className="label">Application Date:</span>
              <span className="value">
                {formatDate(bailData.date_of_application)}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Police Station:</span>
              <span className="value">{bailData.police_station_name}</span>
            </div>
            <div className="status-item">
              <span className="label">Offence Type:</span>
              <span className="value">{bailData.offence_type}</span>
            </div>
            <div className="status-item">
              <span className="label">Lawyer Email:</span>
              <span className="value">{bailData.Lawyer_email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStatus;
