// src/pages/nurse/VitalSigns.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/staffService';

function NurseVitalSigns() {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [filters, setFilters] = useState({
    patient_id: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    fetchVitalSigns();
  }, [filters]);

  const fetchVitalSigns = async () => {
    try {
      setLoading(true);
      const response = await staffService.getVitalSigns(filters);
      setVitalSigns(response.vital_signs || []);
    } catch (error) {
    //   setError('Failed to fetch vital signs');
    //   setError('Patient Id is required to get vital signs');
      console.error('Error fetching vital signs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordVitalSigns = async (vitalData) => {
    try {
      await staffService.recordVitalSigns(vitalData);
      alert('Vital signs recorded successfully');
      setShowRecordModal(false);
      fetchVitalSigns();
    } catch (error) {
      alert('Failed to record vital signs');
      console.error('Error recording vital signs:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading vital signs...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Vital Signs Management</h1>
        <button 
          onClick={() => setShowRecordModal(true)}
          className="btn-primary"
        >
          Record Vital Signs
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Patient ID:</label>
          <input
            type="number"
            name="patient_id"
            value={filters.patient_id}
            onChange={handleFilterChange}
            placeholder="Filter by patient ID"
            className="filter-select"
          />
        </div>
        <div className="filter-group">
          <label>From Date:</label>
          <input
            type="date"
            name="date_from"
            value={filters.date_from}
            onChange={handleFilterChange}
            className="filter-select"
          />
        </div>
        <div className="filter-group">
          <label>To Date:</label>
          <input
            type="date"
            name="date_to"
            value={filters.date_to}
            onChange={handleFilterChange}
            className="filter-select"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {vitalSigns.length === 0 ? (
        <div className="empty-state">
          <h3>No vital signs found</h3>
          <p>No vital signs match your current filters.</p>
        </div>
      ) : (
        <div className="vital-signs-list">
          {vitalSigns.map((vital) => (
            <div key={vital.id} className="vital-sign-card">
              <div className="vital-sign-header">
                <div>
                  <h3>Patient #{vital.patient_id}</h3>
                  <p className="vital-meta">
                    Recorded: {formatDate(vital.recorded_at)} 
                    {vital.recorded_by && ` • By: Nurse #${vital.recorded_by}`}
                  </p>
                </div>
                <span className="status-badge status-completed">
                  {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                </span>
              </div>
              
              <div className="vital-sign-grid">
                <div className="vital-item">
                  <label>Heart Rate:</label>
                  <span className="vital-value">{vital.heart_rate} bpm</span>
                </div>
                <div className="vital-item">
                  <label>Respiratory Rate:</label>
                  <span className="vital-value">{vital.respiratory_rate} rpm</span>
                </div>
                <div className="vital-item">
                  <label>Temperature:</label>
                  <span className="vital-value">{vital.temperature}°C</span>
                </div>
                <div className="vital-item">
                  <label>Oxygen Saturation:</label>
                  <span className="vital-value">{vital.oxygen_saturation}%</span>
                </div>
                <div className="vital-item">
                  <label>Blood Sugar:</label>
                  <span className="vital-value">{vital.blood_sugar || 'N/A'} mg/dL</span>
                </div>
                <div className="vital-item">
                  <label>Weight/Height:</label>
                  <span className="vital-value">{vital.weight}kg / {vital.height}cm</span>
                </div>
              </div>

              {vital.notes && (
                <div className="vital-notes">
                  <p><strong>Notes:</strong> {vital.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Record Vital Signs Modal */}
      {showRecordModal && (
        <RecordVitalSignsModal
          onClose={() => setShowRecordModal(false)}
          onSave={handleRecordVitalSigns}
        />
      )}
    </div>
  );
}

// Record Vital Signs Modal Component
function RecordVitalSignsModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    patient_id: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    respiratory_rate: '',
    temperature: '',
    oxygen_saturation: '',
    weight: '',
    height: '',
    blood_sugar: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['patient_id', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field.replace(/_/g, ' ')}`);
        return;
      }
    }

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>Record Vital Signs</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="vital-signs-form">
          <div className="form-group">
            <label>Patient ID *</label>
            <input
              type="number"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              placeholder="Enter patient ID"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Blood Pressure (Systolic) *</label>
              <input
                type="number"
                name="blood_pressure_systolic"
                value={formData.blood_pressure_systolic}
                onChange={handleChange}
                placeholder="e.g., 120"
                min="50"
                max="250"
                required
              />
            </div>
            <div className="form-group">
              <label>Blood Pressure (Diastolic) *</label>
              <input
                type="number"
                name="blood_pressure_diastolic"
                value={formData.blood_pressure_diastolic}
                onChange={handleChange}
                placeholder="e.g., 80"
                min="30"
                max="150"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Heart Rate (bpm) *</label>
              <input
                type="number"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                placeholder="e.g., 72"
                min="30"
                max="200"
                required
              />
            </div>
            <div className="form-group">
              <label>Respiratory Rate (rpm)</label>
              <input
                type="number"
                name="respiratory_rate"
                value={formData.respiratory_rate}
                onChange={handleChange}
                placeholder="e.g., 16"
                min="8"
                max="40"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="e.g., 36.6"
                min="35"
                max="42"
              />
            </div>
            <div className="form-group">
              <label>Oxygen Saturation (%)</label>
              <input
                type="number"
                step="0.1"
                name="oxygen_saturation"
                value={formData.oxygen_saturation}
                onChange={handleChange}
                placeholder="e.g., 98.5"
                min="70"
                max="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 68.5"
                min="2"
                max="300"
              />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                step="0.1"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 170"
                min="30"
                max="250"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Blood Sugar (mg/dL)</label>
            <input
              type="number"
              step="0.1"
              name="blood_sugar"
              value={formData.blood_sugar}
              onChange={handleChange}
              placeholder="e.g., 95"
              min="50"
              max="500"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the patient's condition..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Recording...' : 'Record Vital Signs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NurseVitalSigns;