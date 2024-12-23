import React, { useState } from "react";
import { Search } from "lucide-react";
import axiosInstance from "../../../api/axios";
import "./PastCaseReview.css";

const PastCaseReview = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", query);

      const response = await axiosInstance.post(
        "/api/v1/lawyer/lawyer/past/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data)
      setSearchResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "An error occurred while fetching results"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Past Case Analysis</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search legal cases..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            <Search size={20} />
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {searchResults && !isLoading && !error && (
        <div className="results-container">
          <h2>Similar Cases</h2>
          {searchResults.similar_cases.map((caseData, index) => (
            <div key={index} className="case-card">
              <h3>Case {index + 1} {caseData.id}</h3>
              <p>
                <strong>Summary:</strong>
              </p>
              <p>{caseData.summary}</p>
              <p>
                <strong>Bail Status:</strong>{" "}
                {caseData.bail_status === "Yes" ? "Granted" : "Denied"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastCaseReview;
