// ChargeSheetForm.jsx
import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  FileInput, 
  Users, 
  History,
  Save,
  AlertCircle 
} from 'lucide-react';
import axiosInstance from '../../../api/axios';
import './ChargeSheetForm.css';
import { useNavigate } from 'react-router-dom';
const ChargeSheetForm = () => {
  const [formData, setFormData] = useState({
    case_id: '',
    date_of_arrest: '',
    evidence_facts_collected: '',
    witness_statement: '',
    previous_criminal_record: ''
  });
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    
    // Create a Date object from the input date
    const date = new Date(dateString);
    
    // Set the time to noon UTC to avoid timezone issues
    date.setUTCHours(12, 0, 0, 0);
    
    // Return the ISO string
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Create the formatted data payload
      const formattedData = {
        ...formData,
        date_of_arrest: formatDateForBackend(formData.date_of_arrest)
      };

      console.log('Sending data:', formattedData); // Debug log

      const response = await axiosInstance.post('/api/v1/charge_sheet/charge-sheets/', formattedData);
      
      console.log('Response:', response); // Debug log
      
      setSuccess(true);
      alert("Successfully application created")
      navigate("/police-dashboard")
      setFormData({
        case_id: '',
        date_of_arrest: '',
        evidence_facts_collected: '',
        witness_statement: '',
        previous_criminal_record: ''
      });

    } catch (err) {
      console.error('Error details:', err.response?.data); // Debug log
      setError(err.response?.data?.detail || 'An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="charge-sheet-container">
      <h1 className="form-title">
        <FileText className="title-icon" />
        Charge Sheet Filing Form
      </h1>

      {error && (
        <div className="error-message">
          <AlertCircle className="error-icon" />
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          Charge sheet successfully filed!
        </div>
      )}

      <form onSubmit={handleSubmit} className="charge-sheet-form">
        <div className="form-group">
          <label>
            <FileInput className="field-icon" />
            Case ID
          </label>
          <input
            type="text"
            name="case_id"
            value={formData.case_id}
            onChange={handleChange}
            required
            placeholder="Enter Case ID"
          />
        </div>

        <div className="form-group">
          <label>
            <Calendar className="field-icon" />
            Date of Arrest
          </label>
          <input
            type="datetime-local" // Changed back to datetime-local
            name="date_of_arrest"
            value={formData.date_of_arrest}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FileText className="field-icon" />
            Evidence Facts Collected
          </label>
          <textarea
            name="evidence_facts_collected"
            value={formData.evidence_facts_collected}
            onChange={handleChange}
            required
            placeholder="Enter evidence facts..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>
            <Users className="field-icon" />
            Witness Statement
          </label>
          <textarea
            name="witness_statement"
            value={formData.witness_statement}
            onChange={handleChange}
            required
            placeholder="Enter witness statement..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>
            <History className="field-icon" />
            Previous Criminal Record
          </label>
          <textarea
            name="previous_criminal_record"
            value={formData.previous_criminal_record}
            onChange={handleChange}
            required
            placeholder="Enter previous criminal record..."
            rows={4}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          <Save className="button-icon" />
          {loading ? 'Filing...' : 'File Charge Sheet'}
        </button>
      </form>
    </div>
  );
};

export default ChargeSheetForm;