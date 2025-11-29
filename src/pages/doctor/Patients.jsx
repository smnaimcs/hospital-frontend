// src/pages/doctor/Patients.jsx
import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';

function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  useEffect(() => {
    // Extract unique patients from appointments
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAppointments();
      const appointments = response.appointments || [];
      
      // Extract unique patients
      const uniquePatients = [];
      const patientIds = new Set();
      
      appointments.forEach(appointment => {
        if (!patientIds.has(appointment.patient.id)) {
          patientIds.add(appointment.patient.id);
          uniquePatients.push(appointment.patient);
        }
      });
      
      setPatients(uniquePatients);
    } catch (error) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalHistory = async (patientId) => {
    try {
      const response = await doctorService.getPatientMedicalHistory(patientId);
      setMedicalHistory(response);
      setShowMedicalHistory(true);
    } catch (error) {
      alert('Failed to fetch medical history');
      console.error('Error fetching medical history:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Patients</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {patients.length === 0 ? (
        <div className="empty-state">
          <h3>No patients found</h3>
          <p>You don't have any patients yet.</p>
        </div>
      ) : (
        <div className="patients-grid">
          {patients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <div className="patient-header">
                <h3>{patient.user.first_name} {patient.user.last_name}</h3>
                <span className="patient-age">
                  {patient.user.date_of_birth ? 
                    `Age: ${new Date().getFullYear() - new Date(patient.user.date_of_birth).getFullYear()}` 
                    : 'Age: Unknown'}
                </span>
              </div>
              
              <div className="patient-details">
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{patient.user.email}</span>
                </div>
                
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{patient.user.phone || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <label>Blood Group:</label>
                  <span>{patient.blood_group || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <label>Emergency Contact:</label>
                  <span>{patient.emergency_contact || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <label>Insurance:</label>
                  <span>{patient.insurance_info || 'Not provided'}</span>
                </div>
              </div>

              <div className="patient-actions">
                <button 
                  onClick={() => {
                    setSelectedPatient(patient);
                    fetchMedicalHistory(patient.id);
                  }}
                  className="btn-primary"
                >
                  View Medical History
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medical History Modal */}
      {showMedicalHistory && medicalHistory && (
        <MedicalHistoryModal
          patient={selectedPatient}
          medicalHistory={medicalHistory}
          onClose={() => {
            setShowMedicalHistory(false);
            setMedicalHistory(null);
          }}
        />
      )}
    </div>
  );
}

// Medical History Modal Component
function MedicalHistoryModal({ patient, medicalHistory, onClose }) {
  const [activeTab, setActiveTab] = useState('diagnoses');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>Medical History - {patient.user.first_name} {patient.user.last_name}</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'diagnoses' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagnoses')}
          >
            Diagnoses
          </button>
          <button 
            className={`tab ${activeTab === 'test-reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('test-reports')}
          >
            Test Reports
          </button>
          <button 
            className={`tab ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            Prescriptions
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'diagnoses' && (
            <div className="medical-history-section">
              <h3>Diagnoses</h3>
              {medicalHistory.diagnoses.length === 0 ? (
                <p>No diagnoses found.</p>
              ) : (
                medicalHistory.diagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className="medical-record-card">
                    <h4>{diagnosis.diagnosis}</h4>
                    <p><strong>Symptoms:</strong> {diagnosis.symptoms}</p>
                    <p><strong>Treatment Plan:</strong> {diagnosis.treatment_plan}</p>
                    <p><strong>Notes:</strong> {diagnosis.notes}</p>
                    {diagnosis.follow_up_required && (
                      <p><strong>Follow-up Date:</strong> {formatDate(diagnosis.follow_up_date)}</p>
                    )}
                    <p className="record-date">Recorded: {formatDate(diagnosis.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'test-reports' && (
            <div className="medical-history-section">
              <h3>Test Reports</h3>
              {medicalHistory.test_reports.length === 0 ? (
                <p>No test reports found.</p>
              ) : (
                medicalHistory.test_reports.map((report) => (
                  <div key={report.id} className="medical-record-card">
                    <h4>{report.test_name}</h4>
                    <p><strong>Type:</strong> {report.test_type}</p>
                    <p><strong>Result:</strong> {report.result}</p>
                    <p><strong>Normal Range:</strong> {report.normal_range}</p>
                    <p><strong>Units:</strong> {report.units}</p>
                    <p><strong>Comments:</strong> {report.comments}</p>
                    <p className="record-date">Completed: {formatDate(report.completed_date)}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="medical-history-section">
              <h3>Prescriptions</h3>
              {medicalHistory.prescriptions && medicalHistory.prescriptions.length === 0 ? (
                <p>No prescriptions found.</p>
              ) : (
                medicalHistory.prescriptions?.map((prescription) => (
                  <div key={prescription.id} className="medical-record-card">
                    <h4>{prescription.medicine_name}</h4>
                    <p><strong>Dosage:</strong> {prescription.dosage}</p>
                    <p><strong>Frequency:</strong> {prescription.frequency}</p>
                    <p><strong>Duration:</strong> {prescription.duration}</p>
                    <p><strong>Instructions:</strong> {prescription.instructions}</p>
                    <p className="record-date">Prescribed: {formatDate(prescription.created_at)}</p>
                  </div>
                )) || <p>No prescriptions data available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorPatients;