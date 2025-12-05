// src/pages/lab-technician/Attendance.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/staffService';

function LabTechnicianAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [filters, setFilters] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    } else {
      fetchLeaveRequests();
    }
  }, [activeTab, filters]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAttendanceHistory(filters);
      setAttendance(response.attendance || []);
    } catch (error) {
      setError('Failed to fetch attendance history');
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await staffService.getLeaveRequests();
      setLeaveRequests(response.leave_requests || []);
    } catch (error) {
      setError('Failed to fetch leave requests');
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await staffService.checkIn();
      alert('Checked in successfully');
      fetchAttendance();
    } catch (error) {
      alert('Failed to check in');
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await staffService.checkOut();
      alert('Checked out successfully');
      fetchAttendance();
    } catch (error) {
      alert('Failed to check out');
      console.error('Error checking out:', error);
    }
  };

  const handleRequestLeave = async (leaveData) => {
    try {
      await staffService.requestLeave(leaveData);
      alert('Leave request submitted successfully');
      setShowLeaveModal(false);
      fetchLeaveRequests();
    } catch (error) {
      alert('Failed to submit leave request');
      console.error('Error submitting leave request:', error);
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find(record => record.date === today);
  };

  const calculateTotalHours = (attendance) => {
    return attendance.reduce((total, record) => {
      return total + (record.total_hours || 0);
    }, 0);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      present: 'status-completed',
      absent: 'status-cancelled',
      late: 'status-pending',
      half_day: 'status-confirmed'
    };
    
    return <span className={`status-badge ${statusColors[status] || ''}`}>{status}</span>;
  };

  const getLeaveStatusBadge = (status) => {
    const statusColors = {
      approved: 'status-completed',
      pending: 'status-pending',
      rejected: 'status-cancelled'
    };
    
    return <span className={`status-badge ${statusColors[status] || ''}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading attendance data...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Attendance & Leave Management</h1>
        <div className="header-actions">
          {activeTab === 'attendance' && (
            <>
              <button onClick={handleCheckIn} className="btn-primary">
                Check In
              </button>
              <button onClick={handleCheckOut} className="btn-secondary">
                Check Out
              </button>
            </>
          )}
          {activeTab === 'leave' && (
            <button 
              onClick={() => setShowLeaveModal(true)}
              className="btn-primary"
            >
              Request Leave
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button 
          className={`tab ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          Leave Requests
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tab-content">
        {activeTab === 'attendance' ? (
          <div className="attendance-section">
            {/* Today's Status */}
            <div className="today-status">
              <h3>Today's Status</h3>
              {getTodayAttendance() ? (
                <div className="attendance-card current">
                  <div className="attendance-info">
                    <h4>Checked In</h4>
                    <p>Time: {formatTime(getTodayAttendance().check_in)}</p>
                    {getTodayAttendance().check_out && (
                      <p>Check Out: {formatTime(getTodayAttendance().check_out)}</p>
                    )}
                    {getTodayAttendance().total_hours && (
                      <p>Total Hours: {getTodayAttendance().total_hours.toFixed(2)}</p>
                    )}
                  </div>
                  {getStatusBadge(getTodayAttendance().status)}
                </div>
              ) : (
                <div className="attendance-card not-checked-in">
                  <p>You haven't checked in today</p>
                  <button onClick={handleCheckIn} className="btn-primary">
                    Check In Now
                  </button>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  className="filter-select"
                />
              </div>
              <div className="filter-group">
                <label>End Date:</label>
                <input
                  type="date"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  className="filter-select"
                />
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="attendance-summary">
              <h3>Attendance History</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <span>Total Days:</span>
                  <span>{attendance.length}</span>
                </div>
                <div className="summary-item">
                  <span>Total Hours:</span>
                  <span>{calculateTotalHours(attendance).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Present Days:</span>
                  <span>{attendance.filter(a => a.status === 'present').length}</span>
                </div>
              </div>
            </div>

            {/* Attendance List */}
            {attendance.length === 0 ? (
              <div className="empty-state">
                <h3>No attendance records found</h3>
                <p>No attendance records match your current filters.</p>
              </div>
            ) : (
              <div className="attendance-list">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Total Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.check_in ? formatTime(record.check_in) : 'N/A'}</td>
                        <td>{record.check_out ? formatTime(record.check_out) : 'N/A'}</td>
                        <td>{record.total_hours ? record.total_hours.toFixed(2) : 'N/A'}</td>
                        <td>{getStatusBadge(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="leave-section">
            <h2>My Leave Requests</h2>
            
            {leaveRequests.length === 0 ? (
              <div className="empty-state">
                <h3>No leave requests found</h3>
                <p>You haven't submitted any leave requests yet.</p>
              </div>
            ) : (
              <div className="leave-requests-list">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="leave-request-card">
                    <div className="leave-header">
                      <div>
                        <h4>{request.leave_type}</h4>
                        <p className="leave-dates">
                          {formatDate(request.start_date)} to {formatDate(request.end_date)}
                        </p>
                      </div>
                      {getLeaveStatusBadge(request.status)}
                    </div>
                    
                    <div className="leave-details">
                      <p><strong>Reason:</strong> {request.reason}</p>
                      <p><strong>Submitted:</strong> {formatDate(request.created_at)}</p>
                      {request.comments && (
                        <p><strong>Admin Comments:</strong> {request.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Leave Modal */}
      {showLeaveModal && (
        <RequestLeaveModal
          onClose={() => setShowLeaveModal(false)}
          onSave={handleRequestLeave}
        />
      )}
    </div>
  );
}

// Request Leave Modal Component
function RequestLeaveModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: ''
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
    
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      alert('End date cannot be before start date');
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
          <h2>Request Leave</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-group">
            <label>Leave Type *</label>
            <select
              name="leave_type"
              value={formData.leave_type}
              onChange={handleChange}
              required
            >
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please provide a reason for your leave request..."
              rows="4"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LabTechnicianAttendance;