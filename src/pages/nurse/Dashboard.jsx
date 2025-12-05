// src/pages/nurse/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import staffService from '../../services/staffService';

function NurseDashboard() {
  const [stats, setStats] = useState({});
  const [recentVitals, setRecentVitals] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent vital signs
      // const vitalsResponse = await staffService.getVitalSigns();
      // const vitals = vitalsResponse.vital_signs || [];
      // setRecentVitals(vitals.slice(0, 5));
      
      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0];
      const attendanceResponse = await staffService.getAttendanceHistory({
        start_date: today,
        end_date: today
      });
      
      const todayAttendance = attendanceResponse.attendance?.[0] || null;
      setAttendanceStatus(todayAttendance);

      // Calculate stats
      // const medicalRecordsResponse = await staffService.getMedicalRecords();
      // const records = medicalRecordsResponse.medical_records || [];
      
      setStats({
        // totalVitals: vitals.length,
        // todayVitals: vitals.filter(v => new Date(v.recorded_at).toDateString() === new Date().toDateString()).length,
        // totalRecords: records.length
      });
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await staffService.checkIn();
      alert('Checked in successfully');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to check in');
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await staffService.checkOut();
      alert('Checked out successfully');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to check out');
      console.error('Error checking out:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Nurse Dashboard</h1>
        <div className="attendance-status">
          {attendanceStatus ? (
            <div className="attendance-info">
              <span className="status-badge status-completed">
                Checked In: {formatDate(attendanceStatus.check_in)}
              </span>
              {!attendanceStatus.check_out && (
                <button onClick={handleCheckOut} className="btn-primary">
                  Check Out
                </button>
              )}
            </div>
          ) : (
            <button onClick={handleCheckIn} className="btn-primary">
              Check In
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon vital">
            <i className="fas fa-heartbeat"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalVitals || 0}</h3>
            <p>Total Vital Signs</p>
          </div>
          <Link to="/nurse/vital-signs" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon today">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.todayVitals || 0}</h3>
            <p>Today's Vitals</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon records">
            <i className="fas fa-file-medical"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRecords || 0}</h3>
            <p>Medical Records</p>
          </div>
          <Link to="/nurse/medical-records" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon attendance">
            <i className="fas fa-user-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{attendanceStatus ? 'Present' : 'Absent'}</h3>
            <p>Today's Status</p>
          </div>
          <Link to="/nurse/attendance" className="stat-link">View History</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/nurse/vital-signs?action=new" className="action-card">
            <i className="fas fa-heartbeat"></i>
            <span>Record Vital Signs</span>
          </Link>
          <Link to="/nurse/patient-arrival" className="action-card">
            <i className="fas fa-procedures"></i>
            <span>Patient Arrival</span>
          </Link>
          <Link to="/nurse/medical-records?action=new" className="action-card">
            <i className="fas fa-file-medical-alt"></i>
            <span>Add Medical Record</span>
          </Link>
          <Link to="/nurse/attendance" className="action-card">
            <i className="fas fa-history"></i>
            <span>Attendance</span>
          </Link>
        </div>
      </div>

      {/* Recent Vital Signs */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Vital Signs</h2>
          <Link to="/nurse/vital-signs" className="btn-secondary">View All</Link>
        </div>
        
        {recentVitals.length === 0 ? (
          <div className="empty-state">
            <h3>No vital signs recorded</h3>
            <p>You haven't recorded any vital signs yet.</p>
          </div>
        ) : (
          <div className="recent-vitals">
            {recentVitals.map((vital) => (
              <div key={vital.id} className="vital-card">
                <div className="vital-header">
                  <h4>Patient #{vital.patient_id}</h4>
                  <span className="status-badge status-completed">
                    {formatDate(vital.recorded_at)}
                  </span>
                </div>
                <div className="vital-details">
                  <div className="vital-item">
                    <span>BP:</span>
                    <strong>{vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}</strong>
                  </div>
                  <div className="vital-item">
                    <span>HR:</span>
                    <strong>{vital.heart_rate} bpm</strong>
                  </div>
                  <div className="vital-item">
                    <span>Temp:</span>
                    <strong>{vital.temperature}°C</strong>
                  </div>
                  <div className="vital-item">
                    <span>SpO₂:</span>
                    <strong>{vital.oxygen_saturation}%</strong>
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
      </div>
    </div>
  );
}

export default NurseDashboard;