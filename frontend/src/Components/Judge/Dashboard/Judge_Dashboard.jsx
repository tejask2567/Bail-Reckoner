import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import "./Judge_Dashboard.css";
import { useNavigate } from "react-router-dom";
import GeminiChatbox from '../../Home/GeminiChatbox'
const Judge_Dashboard = () => {
  const [bails, setBails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  useEffect(() => {
    fetchBails();
  }, [currentPage, search]);

  const fetchBails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/v1/bail`, {
        params: {
          search: search,
          page: currentPage,
          size: 30,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setBails(response.data.items);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError("Failed to fetch bail applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchBails();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderPagination = () => {
    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by Case ID or Plaintiff name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input1"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="bails-container">
        {bails.map((bail) => (
          <div
            key={bail.bail_id}
            className="bail-card"
            onClick={() => navigate(`/judge-dashboard/${bail.bail_id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="bail-id-section">
              <h3>Case Details</h3>
              <p>Case ID: {bail.case_id}</p>
              <p>Filed: {formatDate(bail.current_datetime)}</p>
            </div>
            <div className="bail-subject-section">
              <h3>Subject</h3>
              <p>{bail.bail_subject}</p>
              <div className="bail-details">
                <p>Plaintiff: {bail.plaintiff}</p>
                <p>Defendant: {bail.defendant_name}</p>
                <p>Lawyer Email: {bail.Lawyer_email}</p>
              </div>
            </div>
            <div className="bail-type-section">
              <h3>Type</h3>
              <p className={`bail-type ${bail.bail_type.toLowerCase()}`}>
                {bail.bail_type}
              </p>
              {bail.status && (
                <p className={`bail-status ${bail.status.toLowerCase()}`}>
                  {bail.status}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className={`chatbox-container ${isChatboxOpen ? "block" : "hidden"}`}
      >
        <div className="fixed bottom-24 left-8 w-96 z-[2001]">
          <GeminiChatbox />
        </div>
      </div>
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default Judge_Dashboard;
