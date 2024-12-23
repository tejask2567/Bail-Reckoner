// AiResponse.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import { ArrowLeft, User, MapPin, AlertCircle, Check, X } from "lucide-react";
import axiosInstance from "../../../api/axios";
import "./AiResponse.css";

const AiResponse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chargeSheetData, setChargeSheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { bailId: bailIdFromState } = location.state || {};
  const {
    case_id,
    plaintiff,
    plaintiff_age,
    plaintiff_sex,
    plaintiff_address,
    nationality,
    occupation,
    defendant_name,
    defendant_address,
    bail_type,
    offence_type,
    fir_ID,
    fir_date,
    bail_subject,
    police_station_name,
    police_station_address,
    interm_bail,
    bail_document,
    list_of_affidivit,
    
  } = location.state || {};
  
  const formatText = (text) => {
    return text.split("\n").map((line, index) => {
      // Handle bold text
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      // Return different elements based on line content
      if (line.trim().startsWith("**")) {
        return (
          <h3 key={index} className="font-bold text-lg mt-4 mb-2">
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </h3>
        );
      } else if (line.trim().match(/^\d+\./)) {
        return (
          <li key={index} className="ml-8 mb-2">
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </li>
        );
      } else if (line.trim() === "") {
        return <br key={index} />;
      } else {
        return (
          <p key={index} className="mb-2">
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </p>
        );
      }
    });
  };

  const handleBailUpdate = async (status) => {
  
    console.log("BailId from state:", location.state?.bailId);
    setUpdating(true);
    try {
      const response = await axiosInstance.put(
        `/api/v1/bail/${location.state?.bailId}`,
        {
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Show success message and redirect
      alert(`Bail application ${status === 'approved' ? 'approved' : 'denied'} successfully`);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${status} bail application`);
    } finally {
      setUpdating(false);
    }
  };

  const debugChargeSheet = async () => {
    try {
      // Format the data before sending
      const formattedData = {
        case_id: case_id?.toString() || null,
        plaintiff: plaintiff || null,
        plaintiff_age: plaintiff_age
          ? parseInt(plaintiff_age, 10) || plaintiff_age.toString()
          : null,
        plaintiff_sex: plaintiff_sex || null,
        plaintiff_address: plaintiff_address || null,
        nationality: nationality || null,
        occupation: occupation || null,
        defendant_name: defendant_name || null,
        defendant_address: defendant_address || null,
        bail_type: bail_type || null,
        offence_type: offence_type || null,
        fir_ID: fir_ID || null,
        fir_date: fir_date || null,
        bail_subject: bail_subject || null,
        police_station_name: police_station_name || null,
        police_station_address: police_station_address || null,
        interm_bail: interm_bail || null,
        bail_document: bail_document || null,
        list_of_affidivit: Array.isArray(list_of_affidivit)
          ? list_of_affidivit
          : list_of_affidivit
          ? [list_of_affidivit]
          : null,
      };

      console.log("Sending data:", formattedData);

      const response = await axiosInstance.post(
        "/api/v1/charge_sheet/debug-charge-sheet",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Debug Response:", response.data);
      setChargeSheetData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Debug Error:", err.response?.data || err);
      throw err;
    }
  };

  useEffect(() => {
    if (case_id) {
      debugChargeSheet().catch((err) => {
        setError(err.response?.data?.message || "Failed to debug charge sheet");
        setLoading(false);
      });
    }
  }, [case_id]);

  if (loading) {
    return (
      <div className="charge-sheet-loading">
        <AlertCircle className="animate-spin" size={24} />
        Generating AI response...
      </div>
    );
  }

  if (error) {
    return <div className="charge-sheet-error">{error}</div>;
  }

  return (
    <div className="charge-sheet-container1">
      <div className="charge-sheet-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to Case
        </button>
        <h1>AI Report Details</h1>
        <div className="action-buttons">
          <button 
            className="approve-button"
            onClick={() => handleBailUpdate('approved')}
            disabled={updating}
          >
            <Check size={20} />
            Approve
          </button>
          <button 
            className="deny-button"
            onClick={() => handleBailUpdate('denied')}
            disabled={updating}
          >
            <X size={20} />
            Deny
          </button>
        </div>
      </div>

      <div className="parties-container">
        <div className="party-section plaintiff">
          <div className="party-header">
            <User size={24} />
            <h2>Plaintiff</h2>
          </div>
          <div className="party-details">
            <h3>{plaintiff}</h3>
            <div className="address">
              <MapPin size={16} />
              <p>{plaintiff_address}</p>
            </div>
            <div className="additional-info">
              <p>Age: {plaintiff_age}</p>
              <p>Sex: {plaintiff_sex}</p>
              <p>Nationality: {nationality}</p>
              <p>Occupation: {occupation}</p>
            </div>
          </div>
        </div>

        <div className="versus">VS</div>

        <div className="party-section defendant">
          <div className="party-header">
            <User size={24} />
            <h2>Defendant</h2>
          </div>
          <div className="party-details">
            <h3>{defendant_name}</h3>
            <div className="address">
              <MapPin size={16} />
              <p>{defendant_address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="charge-sheet-content">
        <h2>AI Response</h2>
        <div className="response-box">
          {chargeSheetData ? (
            <pre>{formatText(chargeSheetData)}</pre>
          ) : (
            <p>No charge sheet data available</p>
          )}
        </div>
      </div>

      <div className="case-details">
        <h2>Case Details</h2>
        <div className="details-grid">
          <div className="detail-item">
            <strong>Case ID:</strong> {case_id}
          </div>
          <div className="detail-item">
            <strong>Bail Type:</strong> {bail_type}
          </div>
          <div className="detail-item">
            <strong>Offence Type:</strong> {offence_type}
          </div>
          {bail_type === "Regular" && (
            <>
              <div className="detail-item">
                <strong>FIR ID:</strong> {fir_ID}
              </div>
              <div className="detail-item">
                <strong>FIR Date:</strong> {fir_date}
              </div>
            </>
          )}
          <div className="detail-item">
            <strong>Police Station:</strong> {police_station_name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiResponse;