// BailCaseView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  FileText,
  Shield,
  Clock,
  AlertCircle,
  FileOutput,
} from "lucide-react";
import axiosInstance from "../../../api/axios";
import "./BailCaseView.css";

const BailCaseView = () => {
  const { bailId } = useParams();
  const navigate = useNavigate();
  const [bailCase, setBailCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bailid,setBailid]=useState("")
  useEffect(() => {
    const fetchBailCase = async () => {
      try {
        setLoading(true);
        setError(null);
        setBailid(bailId)
        const response = await axiosInstance.get(`/api/v1/bail/${bailId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.data) {
          setBailCase(response.data);
        } else {
          setError("No data received from server");
        }
      } catch (err) {
        console.error("Error details:", err);
        setError(
          err.response?.data?.message || "Failed to fetch bail case details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (bailId) {
      fetchBailCase();
    } else {
      setError("No bail ID provided");
      setLoading(false);
    }
  }, [bailId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleGenerateReport = () => {
    if (!bailCase) return;
    
    navigate(`/judge-dashboard/reportai`, {
      state: {
        bailId: bailId,
        case_id: bailCase.case_id,
        plaintiff: bailCase.plaintiff,
        plaintiff_age: bailCase.plaintiff_age,
        plaintiff_sex: bailCase.plaintiff_sex,
        plaintiff_address: bailCase.plaintiff_address,
        nationality: bailCase.nationality,
        occupation: bailCase.occupation,
        defendant_name: bailCase.defendant_name || bailCase.respondent_name, // Fallback to respondent_name if defendant_name is not available
        defendant_address: bailCase.defendant_address || bailCase.respondent_address,
        bail_type: bailCase.bail_type,
        offence_type: bailCase.offence_type,
        fir_ID: bailCase.fir_id,
        fir_date: bailCase.fir_date,
        bail_subject: bailCase.bail_subject,
        police_station_name: bailCase.police_station_name,
        police_station_address: bailCase.police_station_address,
        interm_bail: bailCase.interm_bail,
        bail_document: bailCase.bail_document,
        list_of_affidivit: bailCase.list_of_affidivit
      }
    });
  };

  if (loading) {
    return (
      <div className="bail-case-loading">
        <AlertCircle className="animate-spin" size={24} />
        Loading case details...
      </div>
    );
  }

  if (error) {
    return <div className="bail-case-error">{error}</div>;
  }

  if (!bailCase) {
    return <div className="bail-case-error">Bail case not found</div>;
  }

  return (
    <div className="bail-case-container">
      <div className="bail-case-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="header-right">
          <div className="status-badge">
            <AlertCircle size={16} />
            {bailCase.status}
          </div>
          <button
            className="generate-report-button"
            onClick={handleGenerateReport}
          >
            <FileOutput size={16} />
            Generate AI Report
          </button>
        </div>
      </div>

      <div className="bail-case-title">
        <h1>{bailCase.bail_subject}</h1>
        <div className="bail-ids">
          <span>Bail ID: {bailCase.bail_id}</span>
          <span>Case ID: {bailCase.case_id}</span>
          <span className="bail-type">Type: {bailCase.bail_type}</span>
        </div>
      </div>

      <div className="bail-case-grid">
        <section className="bail-section">
          <h2>
            <Calendar size={20} /> Case Timeline
          </h2>
          <div className="timeline-details">
            <div>
              <strong>Application Date:</strong>
              <p>{formatDate(bailCase.date_of_application)}</p>
            </div>
            <div>
              <strong>Last Updated:</strong>
              <p>{formatDate(bailCase.current_datetime)}</p>
            </div>
          </div>
        </section>

        <section className="bail-section">
          <h2>
            <User size={20} /> Plaintiff Details
          </h2>
          <div className="person-details">
            <strong>Name:</strong>
            <p>{bailCase.plaintiff}</p>
            <strong>Age:</strong>
            <p>{bailCase.plaintiff_age}</p>
            <strong>Sex:</strong>
            <p>{bailCase.plaintiff_sex}</p>
            <strong>Nationality:</strong>
            <p>{bailCase.nationality}</p>
            <strong>Occupation:</strong>
            <p>{bailCase.occupation}</p>
            <strong>Address:</strong>
            <p>{bailCase.plaintiff_address}</p>
          </div>
        </section>

        <section className="bail-section">
          <h2>
            <User size={20} /> Defendant Details
          </h2>
          <div className="person-details">
            <strong>Name:</strong>
            <p>{bailCase.defendant_name || bailCase.respondent_name}</p>
            <strong>Address:</strong>
            <p>{bailCase.defendant_address || bailCase.respondent_address}</p>
          </div>
        </section>

        <section className="bail-section">
          <h2>
            <Shield size={20} /> Police Station Information
          </h2>
          <div className="station-details">
            <strong>Name:</strong>
            <p>{bailCase.police_station_name}</p>
            <strong>Address:</strong>
            <p>{bailCase.police_station_address}</p>
          </div>
        </section>

        {bailCase.bail_type !== "Anticipatory" && (
          <section className="bail-section full-width">
            <h2>
              <FileText size={20} /> FIR Details
            </h2>
            <div className="fir-details">
              <div>
                <strong>FIR ID:</strong>
                <p>{bailCase.fir_id}</p>
              </div>
              <div>
                <strong>FIR Date:</strong>
                <p>{formatDate(bailCase.fir_date)}</p>
              </div>
              <div>
                <strong>Details:</strong>
                <p>{bailCase.fir_detail}</p>
              </div>
            </div>
          </section>
        )}

        <section className="bail-section full-width">
          <h2>
            <FileText size={20} /> Bail Document
          </h2>
          <div className="bail-document">
            <p>{bailCase.bail_document}</p>
          </div>
        </section>

        {bailCase.list_of_affidivit && (
          <section className="bail-section full-width">
            <h2>
              <FileText size={20} /> List of Affidavits
            </h2>
            <div className="affidavit-list">
              <p>{bailCase.list_of_affidivit}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BailCaseView;