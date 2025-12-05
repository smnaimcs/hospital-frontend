// src/pages/lab-technician/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import staffService from '../../services/staffService';
import medicalService from '../../services/medicalService';

function LabTechnicianDashboard() {
  const [stats, setStats] = useState({});
  const [recentTests, setRecentTests] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent test reports
      const testsResponse = await staffService.getTestReports();
      const tests = testsResponse.test_reports || [];
      setRecentTests(tests.slice(0, 5));
      
      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0];
      const attendanceResponse = await staffService.getAttendanceHistory({
        start_date: today,
        end_date: today
      });
      
      const todayAttendance = attendanceResponse.attendance?.[0] || null;
      setAttendanceStatus(todayAttendance);

      // Calculate stats
      setStats({
        totalTests: tests.length,
        pendingTests: tests.filter(test => test.status !== 'completed').length,
        completedTests: tests.filter(test => test.status === 'completed').length
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
      month: 'long',
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
        <h1>Lab Technician Dashboard</h1>
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
          <div className="stat-icon tests">
            <i className="fas fa-vial"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalTests || 0}</h3>
            <p>Total Tests</p>
          </div>
          <Link to="/lab-technician/test-reports" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.completedTests || 0}</h3>
            <p>Completed Tests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingTests || 0}</h3>
            <p>Pending Tests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon attendance">
            <i className="fas fa-user-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{attendanceStatus ? 'Present' : 'Absent'}</h3>
            <p>Today's Status</p>
          </div>
          <Link to="/lab-technician/attendance" className="stat-link">View History</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/lab-technician/test-reports" className="action-card">
            <i className="fas fa-file-medical"></i>
            <span>Upload Test Report</span>
          </Link>
          <Link to="/lab-technician/test-reports" className="action-card">
            <i className="fas fa-list"></i>
            <span>View All Reports</span>
          </Link>
          <Link to="/lab-technician/attendance" className="action-card">
            <i className="fas fa-history"></i>
            <span>Attendance History</span>
          </Link>
          <Link to="/lab-technician/attendance?action=leave" className="action-card">
            <i className="fas fa-calendar-times"></i>
            <span>Request Leave</span>
          </Link>
        </div>
      </div>

      {/* Recent Test Reports */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Test Reports</h2>
          <Link to="/lab-technician/test-reports" className="btn-secondary">View All</Link>
        </div>
        
        {recentTests.length === 0 ? (
          <div className="empty-state">
            <h3>No test reports found</h3>
            <p>You haven't uploaded any test reports yet.</p>
          </div>
        ) : (
          <div className="recent-tests">
            {recentTests.map((test) => (
              <div key={test.id} className="test-card">
                <div className="test-header">
                  <h4>{test.test_name}</h4>
                  <span className={`status-badge ${test.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                    {test.status}
                  </span>
                </div>
                <div className="test-details">
                  <p><strong>Patient ID:</strong> {test.patient_id}</p>
                  <p><strong>Type:</strong> {test.test_type}</p>
                  <p><strong>Completed:</strong> {formatDate(test.completed_date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LabTechnicianDashboard;