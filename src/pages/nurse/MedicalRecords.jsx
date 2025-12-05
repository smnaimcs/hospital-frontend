// src/pages/nurse/MedicalRecords.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/staffService';

function NurseMedicalRecords() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    patient_id: '',
    record_type: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    fetchMedicalRecords();
  }, [filters]);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await staffService.getMedicalRecords(filters);
      setMedicalRecords(response.medical_records || []);
    } catch (error) {
      // setError('Failed to fetch medical records');
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicalRecord = async (recordData) => {
    try {
      await staffService.addMedicalRecord(recordData);
      alert('Medical record added successfully');
      setShowAddModal(false);
      fetchMedicalRecords();
    } catch (error) {
      alert('Failed to add medical record');
      console.error('Error adding medical record:', error);
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
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading medical records...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Medical Records Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Add Medical Record
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
          <label>Record Type:</label>
          <select 
            name="record_type" 
            value={filters.record_type} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="allergy">Allergy</option>
            <option value="diagnosis">Diagnosis</option>
            <option value="treatment">Treatment</option>
            <option value="medication">Medication</option>
            <option value="procedure">Procedure</option>
            <option value="vaccination">Vaccination</option>
            <option value="note">General Note</option>
          </select>
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

      {medicalRecords.length === 0 ? (
        <div className="empty-state">
          <h3>No medical records found</h3>
          <p>No medical records match your current filters.</p>
        </div>
      ) : (
        <div className="medical-records-list">
          {medicalRecords.map((record) => (
            <div key={record.id} className="medical-record-card">
              <div className="record-header">
                <div>
                  <h3 className="record-type">{record.record_type.toUpperCase()}</h3>
                  <p className="record-meta">
                    Patient #{record.patient_id} • Recorded: {formatDate(record.date_recorded || record.created_at)}
                  </p>
                </div>
                <span className="record-badge">
                  {record.record_type}
                </span>
              </div>
              
              <div className="record-content">
                <p><strong>Description:</strong></p>
                <p>{record.description}</p>
              </div>

              <div className="record-footer">
                <span className="record-added">
                  Added: {formatDate(record.created_at)}
                </span>
                {record.recorded_by && (
                  <span className="record-by">
                    By: Nurse #{record.recorded_by}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Medical Record Modal */}
      {showAddModal && (
        <AddMedicalRecordModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMedicalRecord}
        />
      )}
    </div>
  );
}

// Add Medical Record Modal Component
function AddMedicalRecordModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    patient_id: '',
    record_type: 'allergy',
    description: '',
    date_recorded: new Date().toISOString().split('T')[0]
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
    
    if (!formData.patient_id || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add Medical Record</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="medical-record-form">
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

          <div className="form-group">
            <label>Record Type *</label>
            <select
              name="record_type"
              value={formData.record_type}
              onChange={handleChange}
              required
            >
              <option value="allergy">Allergy</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="treatment">Treatment</option>
              <option value="medication">Medication</option>
              <option value="procedure">Procedure</option>
              <option value="vaccination">Vaccination</option>
              <option value="note">General Note</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date Recorded</label>
            <input
              type="date"
              name="date_recorded"
              value={formData.date_recorded}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description of the medical record..."
              rows="6"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NurseMedicalRecords;