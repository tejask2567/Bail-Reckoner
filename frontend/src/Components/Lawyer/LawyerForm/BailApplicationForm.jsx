
import React, { useState, useEffect } from "react";
import "./BailApplicationForm.css";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftFromLine, Calendar } from "lucide-react";

const BailApplicationForm = () => {
  const [lawyerDetails, setLawyerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bail_type: "",
    case_id: "",
    plaintiff: "",
    plaintiff_address: "",
    plaintiff_age: "",
    plaintiff_sex: "",
    offence_type: "",
    nationality: "",
    occupation: "",
    defendant_name: "",
    defendant_address: "",
    police_station_name: "",
    police_station_address: "",
    bail_subject: "",
    bail_document: "",
    current_datetime: "",
    fir_ID: "",
    fir_date: "",
    fir_document: "",
    interm_bail: "",
    list_of_affidivit: "", // Fixed spelling to match backend
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateTimeChange = (e) => {
    setFormData({
      ...formData,
      current_datetime: e.target.value,
    });
  };

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/lawyer/me");
        setLawyerDetails(response.data);
        setFormData((prevData) => ({
          ...prevData,
          Lawyer_email: response.data.email,
        }));
      } catch (err) {
        setError(err.message || "Failed to fetch lawyer details");
        if (err.message === "Please login to continue") {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lawyerDetails) {
      setError("Lawyer details not available");
      return;
    }

    // Validate required fields
    if (!formData.offence_type) {
      setError("Offence type is required");
      return;
    }

    try {
      const formDataToSubmit = new FormData();

      const formattedData = { ...formData };

      // Format dates
      if (formData.current_datetime) {
        const currentDate = new Date(formData.current_datetime);
        formattedData.current_datetime = currentDate.toISOString().split('.')[0];
      }

      if (formData.fir_date) {
        const firDate = new Date(formData.fir_date);
        formattedData.fir_date = firDate.toISOString().split('.')[0];
      }

      // Handle fir_ID for Regular bail type
      if (formData.bail_type === "Regular") {
        const now = new Date();
        formattedData.fir_ID = now.toISOString().split('.')[0];
      }

      // Append all form data
      Object.keys(formattedData).forEach((key) => {
        if (formattedData[key] !== null && formattedData[key] !== undefined && formattedData[key] !== '') {
          formDataToSubmit.append(key, formattedData[key]);
        }
      });

      formDataToSubmit.append("assigned_lawyer", lawyerDetails._id);
      formDataToSubmit.append("Lawyer_email", lawyerDetails.email);

      console.log('Form data being sent:', Object.fromEntries(formDataToSubmit));

      const response = await axiosInstance.post("/api/v1/bail/", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Form submitted successfully");
      navigate(-1);
    } catch (error) {
      console.error('Detailed error:', error.response?.data);
      setError(error.message);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bail-application-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeftFromLine size={20} />
        <span>Back to Dashboard</span>
      </button>
      {lawyerDetails && (
        <div className="lawyer-info">
          <h3>Filing as:</h3>
          <p>{lawyerDetails.name}</p>
          <p>{lawyerDetails.email}</p>
          <p>Bar ID: {lawyerDetails.barid}</p>
        </div>
      )}
      
      <form className="bail-application-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bail Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="bail_type"
                value="Regular"
                checked={formData.bail_type === "Regular"}
                onChange={handleInputChange}
                required
              />
              Regular Bail
            </label>
            <label>
              <input
                type="radio"
                name="bail_type"
                value="Anticipatory"
                checked={formData.bail_type === "Anticipatory"}
                onChange={handleInputChange}
                required
              />
              Anticipatory Bail
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Case ID</label>
          <input
            type="text"
            name="case_id"
            value={formData.case_id}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Plaintiff Name</label>
          <input
            type="text"
            name="plaintiff"
            value={formData.plaintiff}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Plaintiff Address</label>
          <textarea
            name="plaintiff_address"
            value={formData.plaintiff_address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Plaintiff Age</label>
          <input
            type="text"
            name="plaintiff_age"
            value={formData.plaintiff_age}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Plaintiff Sex</label>
          <input
            type="text"
            name="plaintiff_sex"
            value={formData.plaintiff_sex}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Offence Type</label>
          <input
            type="text"
            name="offence_type"
            value={formData.offence_type}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Defendant Name</label>
          <input
            type="text"
            name="defendant_name"
            value={formData.defendant_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Defendant Address</label>
          <textarea
            name="defendant_address"
            value={formData.defendant_address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Police Station Name</label>
          <input
            type="text"
            name="police_station_name"
            value={formData.police_station_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Police Station Address</label>
          <textarea
            name="police_station_address"
            value={formData.police_station_address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bail Subject</label>
          <textarea
            name="bail_subject"
            value={formData.bail_subject}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bail Document</label>
          <textarea
            name="bail_document"
            value={formData.bail_document}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Current Date and Time</label>
          <div className="datetime-input">
            <input
              type="datetime-local"
              name="current_datetime"
              value={formData.current_datetime}
              onChange={handleDateTimeChange}
              required
            />
            <Calendar className="calendar-icon" size={20} />
          </div>
        </div>

        {formData.bail_type === "Regular" && (
          <>
            <div className="form-group">
              <label>FIR ID</label>
              <input
                type="text"
                name="fir_ID"
                value={formData.fir_ID}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>FIR Date</label>
              <div className="datetime-input">
                <input
                  type="date"
                  name="fir_date"
                  value={formData.fir_date}
                  onChange={handleInputChange}
                  required
                />
                <Calendar className="calendar-icon" size={20} />
              </div>
            </div>

            <div className="form-group">
              <label>FIR Document</label>
              <textarea
                name="fir_document"
                value={formData.fir_document}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Interim Bail</label>
          <textarea
            name="interm_bail"
            value={formData.interm_bail}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>List of Affidavits</label>
          <textarea
            name="list_of_affidivit"
            value={formData.list_of_affidivit}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BailApplicationForm;
