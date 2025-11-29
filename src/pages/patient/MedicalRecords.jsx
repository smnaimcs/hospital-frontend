// src/pages/patient/MedicalRecords.jsx
import React, { useState, useEffect } from 'react';
import medicalService from '../../services/medicalService';

function MedicalRecords() {
  const [activeTab, setActiveTab] = useState('test-reports');
  const [testReports, setTestReports] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicalData();
  }, [activeTab]);

  const fetchMedicalData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'test-reports') {
        const response = await medicalService.getTestReports();
        setTestReports(response.test_reports || []);
      } else {
        const response = await medicalService.getVitalSigns();
        setVitalSigns(response.vital_signs || []);
      }
    } catch (error) {
      setError('Failed to fetch medical data');
      console.error('Error fetching medical data:', error);
    } finally {
      setLoading(false);
    }
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
                  <label>Test Type:</label>
                  <span>{report.test_type}</span>
                </div>
                <div className="detail-item">
                  <label>Requested Date:</label>
                  <span>{formatDate(report.requested_date)}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <label>Result:</label>
                  <span className={report.result === 'Normal ranges' ? 'normal-result' : 'abnormal-result'}>
                    {report.result}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Normal Range:</label>
                  <span>{report.normal_range}</span>
                </div>
              </div>
              
              {report.units && (
                <div className="detail-item">
                  <label>Units:</label>
                  <span>{report.units}</span>
                </div>
              )}
              
              {report.comments && (
                <div className="detail-item">
                  <label>Comments:</label>
                  <span>{report.comments}</span>
                </div>
              )}
              
              {report.completed_date && (
                <div className="detail-item">
                  <label>Completed Date:</label>
                  <span>{formatDate(report.completed_date)}</span>
                </div>
              )}
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
              <div className="vital-item">
                <label>Blood Pressure:</label>
                <span>{vital.blood_pressure}</span>
              </div>
              <div className="vital-item">
                <label>Heart Rate:</label>
                <span>{vital.heart_rate} bpm</span>
              </div>
              <div className="vital-item">
                <label>Temperature:</label>
                <span>{vital.temperature}°F</span>
              </div>
              <div className="vital-item">
                <label>Oxygen Saturation:</label>
                <span>{vital.oxygen_saturation}%</span>
              </div>
              <div className="vital-item">
                <label>Respiratory Rate:</label>
                <span>{vital.respiratory_rate} breaths/min</span>
              </div>
              <div className="vital-item">
                <label>Blood Sugar:</label>
                <span>{vital.blood_sugar} mg/dL</span>
              </div>
              {vital.weight && (
                <div className="vital-item">
                  <label>Weight:</label>
                  <span>{vital.weight} kg</span>
                </div>
              )}
              {vital.height && (
                <div className="vital-item">
                  <label>Height:</label>
                  <span>{vital.height} cm</span>
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Medical Records</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'test-reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('test-reports')}
        >
          Test Reports
        </button>
        <button 
          className={`tab ${activeTab === 'vital-signs' ? 'active' : ''}`}
          onClick={() => setActiveTab('vital-signs')}
        >
          Vital Signs
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading medical records...</div>
      ) : (
        <div className="tab-content">
          {activeTab === 'test-reports' ? renderTestReports() : renderVitalSigns()}
        </div>
      )}
    </div>
  );
}

export default MedicalRecords;