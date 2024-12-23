import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import "./CurrentCase.css";
import { useNavigate } from "react-router-dom";

const CurrentCase = () => {
  const [bails, setBails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lawyerId, setLawyerId] = useState(null);
  const navigate = useNavigate();

  // Fetch lawyer's information when component mounts
  useEffect(() => {
    const fetchLawyerInfo = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/lawyer/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log(response);
        console.log(response.data.email);
        setLawyerId(response.data.email);
      } catch (err) {
        setError("Failed to fetch lawyer information");
        console.error(err);
      }
    };

    fetchLawyerInfo();
  }, []);

  // Fetch bails when page, search, or lawyerId changes
  useEffect(() => {
    if (lawyerId) {
      fetchBails();
    }
  }, [currentPage, search, lawyerId]);

  const fetchBails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/v1/bail/`, {
        params: {
          search: search,
          page: currentPage,
          size: 30,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log(response.data);
      const filteredBails  = response.data.items.filter(item => item.Lawyer_email === lawyerId);

      console.log("filter",filteredBails);
      setBails(filteredBails);
      // Adjust total pages based on filtered results
      const filteredTotalPages = Math.ceil(filteredBails.length / 30);
      setTotalPages(filteredTotalPages || 1);
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

  if (loading && !lawyerId) {
    return <div className="loading">Loading lawyer information...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="heading">Current assigned cases</h1>
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by Bail ID or Case ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
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
            key={bail.case_id}
            className="bail-card"
          >
            <div className="bail-id-section">
              <h3>Case ID</h3>
              <p>{bail.case_id}</p>
            </div>
            <div className="bail-subject-section">
              <h3>Subject</h3>
              <p>{bail.bail_subject}</p>
              <div className="bail-details">
                <p>plaintiff: {bail.plaintiff}</p>
                <p>Offence type: {bail.offence_type}</p>
              </div>
            </div>
            <div className="bail-type-section">
              <h3>Type</h3>
              <p className={`bail-type ${bail.bail_type.toLowerCase()}`}>
                {bail.bail_type}
              </p>
              <p className={`bail-status ${bail.status.toLowerCase()}`}>
                {bail.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default CurrentCase;
