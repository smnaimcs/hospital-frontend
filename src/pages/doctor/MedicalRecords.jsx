// src/pages/doctor/MedicalRecords.jsx
import React, { useState, useEffect } from 'react';
import medicalService from '../../services/medicalService';
import doctorService from '../../services/doctorService';

function DoctorMedicalRecords() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [testReports, setTestReports] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('records');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    fetchMedicalData();
    fetchAppointments();
  }, [activeTab]);

  const fetchMedicalData = async () => {
    try {
      setLoading(true);
      
      // Fetch all medical data
      const [recordsResponse, testsResponse, vitalsResponse] = await Promise.all([
        medicalService.getMedicalRecords(),
        medicalService.getTestReports(),
        medicalService.getVitalSigns()
      ]);

      setMedicalRecords(recordsResponse.medical_records || []);
      setTestReports(testsResponse.test_reports || []);
      setVitalSigns(vitalsResponse.vital_signs || []);
    } catch (error) {
      setError('Failed to fetch medical records');
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await doctorService.getAppointments();
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAddRecord = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const handleSuccess = () => {
    setShowAddModal(false);
    setModalType('');
    fetchMedicalData();
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

  const renderMedicalRecords = () => {
    if (medicalRecords.length === 0) {
      return <div className="empty-state">No medical records found</div>;
    }

    return (
      <div className="records-list">
        {medicalRecords.map((record) => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <h3>{record.record_type}</h3>
              <span className="record-date">{formatDate(record.date_recorded)}</span>
            </div>
            <div className="record-details">
              <p>{record.description}</p>
              <p className="meta-info">Recorded: {formatDate(record.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTestReports = () => {
    if (testReports.length === 0) {
      return <div className="empty-state">No test reports found</div>;
    }

    return (
      <div className="records-list">
        {testReports.map((report) => (
          <div key={report.id} className="record-card">
            <div className="record-header">
              <h3>{report.test_name}</h3>
              <span className={`status-badge ${report.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                {report.status}
              </span>
            </div>
            <div className="record-details">
              <div className="detail-row">
                <div className="detail-item">
                  <label>Type:</label>
                  <span>{report.test_type}</span>
                </div>
                <div className="detail-item">
                  <label>Result:</label>
                  <span className={report.result === 'Normal' ? 'normal-result' : 'abnormal-result'}>
                    {report.result}
                  </span>
                </div>
              </div>
              {report.normal_range && (
                <div className="detail-item">
                  <label>Normal Range:</label>
                  <span>{report.normal_range}</span>
                </div>
              )}
              {report.comments && (
                <div className="detail-item">
                  <label>Comments:</label>
                  <span>{report.comments}</span>
                </div>
              )}
              <p className="meta-info">Completed: {formatDate(report.completed_date)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVitalSigns = () => {
    if (vitalSigns.length === 0) {
      return <div className="empty-state">No vital signs records found</div>;
    }

    return (
      <div className="records-list">
        {vitalSigns.map((vital) => (
          <div key={vital.id} className="record-card">
            <div className="record-header">
              <h3>Vital Signs</h3>
              <span className="record-date">{formatDate(vital.recorded_at)}</span>
            </div>
            <div className="vital-signs-grid">
              {vital.blood_pressure && (
                <div className="vital-item">
                  <label>Blood Pressure:</label>
                  <span>{vital.blood_pressure}</span>
                </div>
              )}
              {vital.heart_rate && (
                <div className="vital-item">
                  <label>Heart Rate:</label>
                  <span>{vital.heart_rate} bpm</span>
                </div>
              )}
              {vital.temperature && (
                <div className="vital-item">
                  <label>Temperature:</label>
                  <span>{vital.temperature}°F</span>
                </div>
              )}
              {vital.oxygen_saturation && (
                <div className="vital-item">
                  <label>Oxygen Saturation:</label>
                  <span>{vital.oxygen_saturation}%</span>
                </div>
              )}
              {vital.respiratory_rate && (
                <div className="vital-item">
                  <label>Respiratory Rate:</label>
                  <span>{vital.respiratory_rate} breaths/min</span>
                </div>
              )}
              {vital.blood_sugar && (
                <div className="vital-item">
                  <label>Blood Sugar:</label>
                  <span>{vital.blood_sugar} mg/dL</span>
                </div>
              )}
              {vital.notes && (
                <div className="vital-item full-width">
                  <label>Notes:</label>
                  <span>{vital.notes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading medical records...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Medical Records</h1>
        <div className="header-actions">
          <button 
            onClick={() => handleAddRecord('test-report')}
            className="btn-primary"
          >
            Add Test Report
          </button>
          <button 
            onClick={() => handleAddRecord('medical-record')}
            className="btn-primary"
          >
            Add Medical Record
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          Medical Records
        </button>
        <button 
          className={`tab ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          Test Reports
        </button>
        <button 
          className={`tab ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          Vital Signs
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'records' && renderMedicalRecords()}
        {activeTab === 'tests' && renderTestReports()}
        {activeTab === 'vitals' && renderVitalSigns()}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddMedicalRecordModal
          type={modalType}
          appointments={appointments}
          onClose={() => {
            setShowAddModal(false);
            setModalType('');
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// Add Medical Record Modal
function AddMedicalRecordModal({ type, appointments, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    appointment_id: '',
    patient_id: '',
    record_type: '',
    description: '',
    date_recorded: new Date().toISOString().split('T')[0],
    // Test report fields
    test_name: '',
    test_type: '',
    result: '',
    normal_range: '',
    units: '',
    comments: ''
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
    
    try {
      setLoading(true);
      
      if (type === 'medical-record') {
        if (!formData.record_type || !formData.description) {
          alert('Please fill in all required fields');
          return;
        }
        await medicalService.addMedicalRecord(formData);
        alert('Medical record added successfully');
      } else if (type === 'test-report') {
        if (!formData.test_name || !formData.test_type || !formData.result) {
          alert('Please fill in all required fields');
          return;
        }
        await medicalService.uploadTestReport(formData);
        alert('Test report uploaded successfully');
      }
      
      onSuccess();
    } catch (error) {
      alert(`Failed to add ${type === 'medical-record' ? 'medical record' : 'test report'}`);
      console.error('Error adding record:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    return type === 'medical-record' ? 'Add Medical Record' : 'Upload Test Report';
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Appointment</label>
            <select
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleChange}
            >
              <option value="">Select Appointment (Optional)</option>
              {appointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.patient.user.first_name} {apt.patient.user.last_name} - {new Date(apt.appointment_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {type === 'medical-record' ? (
            <>
              <div className="form-group">
                <label>Record Type *</label>
                <input
                  type="text"
                  name="record_type"
                  value={formData.record_type}
                  onChange={handleChange}
                  placeholder="e.g., Surgery, Allergy, Chronic Condition"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the medical record..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date Recorded</label>
                <input
                  type="date"
                  name="date_recorded"
                  value={formData.date_recorded}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Test Name *</label>
                  <input
                    type="text"
                    name="test_name"
                    value={formData.test_name}
                    onChange={handleChange}
                    placeholder="e.g., Complete Blood Count"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Test Type *</label>
                  <input
                    type="text"
                    name="test_type"
                    value={formData.test_type}
                    onChange={handleChange}
                    placeholder="e.g., Blood Test, Urine Test"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Result *</label>
                <textarea
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  placeholder="Enter the test results..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Normal Range</label>
                  <input
                    type="text"
                    name="normal_range"
                    value={formData.normal_range}
                    onChange={handleChange}
                    placeholder="e.g., 4.0 - 5.5"
                  />
                </div>
                
                <div className="form-group">
                  <label>Units</label>
                  <input
                    type="text"
                    name="units"
                    value={formData.units}
                    onChange={handleChange}
                    placeholder="e.g., x10^6/μL"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Additional comments..."
                  rows="2"
                />
              </div>
            </>
          )}

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

export default DoctorMedicalRecords;