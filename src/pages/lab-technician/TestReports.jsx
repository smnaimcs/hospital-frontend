// src/pages/lab-technician/TestReports.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/staffService';

function LabTechnicianTestReports() {
  const [testReports, setTestReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    test_type: '',
    status: ''
  });

  useEffect(() => {
    fetchTestReports();
  }, [filters]);

  const fetchTestReports = async () => {
    try {
      setLoading(true);
      const response = await staffService.getTestReports(filters);
      setTestReports(response.test_reports || []);
    } catch (error) {
      setError('Failed to fetch test reports');
      console.error('Error fetching test reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadTestReport = async (testData) => {
    try {
      await staffService.uploadTestReport(testData);
      alert('Test report uploaded successfully');
      setShowUploadModal(false);
      fetchTestReports();
    } catch (error) {
      alert('Failed to upload test report');
      console.error('Error uploading test report:', error);
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

  const getStatusBadge = (status) => {
    return status === 'completed' ? 
      <span className="status-badge status-completed">Completed</span> :
      <span className="status-badge status-pending">Pending</span>;
  };

  if (loading) {
    return <div className="loading">Loading test reports...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Test Reports Management</h1>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary"
        >
          Upload Test Report
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Test Type:</label>
          <select 
            name="test_type" 
            value={filters.test_type} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="blood">Blood Test</option>
            <option value="urine">Urine Test</option>
            <option value="imaging">Imaging</option>
            <option value="biopsy">Biopsy</option>
            <option value="culture">Culture</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {testReports.length === 0 ? (
        <div className="empty-state">
          <h3>No test reports found</h3>
          <p>No test reports match your current filters.</p>
        </div>
      ) : (
        <div className="test-reports-list">
          {testReports.map((report) => (
            <div key={report.id} className="test-report-card">
              <div className="test-report-header">
                <div>
                  <h3>{report.test_name}</h3>
                  <p className="report-meta">
                    Patient ID: {report.patient_id} 
                    {report.appointment_id && ` • Appointment: #${report.appointment_id}`}
                  </p>
                </div>
                {getStatusBadge(report.status)}
              </div>
              
              <div className="test-report-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Test Type:</label>
                    <span>{report.test_type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Requested:</label>
                    <span>{formatDate(report.requested_date)}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Result:</label>
                    <span className="test-result">{report.result}</span>
                  </div>
                </div>

                {report.normal_range && (
                  <div className="detail-item">
                    <label>Normal Range:</label>
                    <span>{report.normal_range}</span>
                  </div>
                )}

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

                <div className="detail-row">
                  <div className="detail-item">
                    <label>Completed:</label>
                    <span>{formatDate(report.completed_date)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Performed By:</label>
                    <span>You</span>
                  </div>
                </div>
              </div>

              <div className="test-report-actions">
                <button className="btn-secondary">
                  <i className="fas fa-print"></i> Print
                </button>
                <button className="btn-secondary">
                  <i className="fas fa-download"></i> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Test Report Modal */}
      {showUploadModal && (
        <UploadTestReportModal
          onClose={() => setShowUploadModal(false)}
          onSave={handleUploadTestReport}
        />
      )}
    </div>
  );
}

// Upload Test Report Modal Component
function UploadTestReportModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    appointment_id: '',
    patient_id: '',
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
    
    if (!formData.test_name || !formData.test_type || !formData.result) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>Upload Test Report</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="test-report-form">
          <div className="form-row">
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
              <label>Appointment ID (Optional)</label>
              <input
                type="number"
                name="appointment_id"
                value={formData.appointment_id}
                onChange={handleChange}
                placeholder="Enter appointment ID"
              />
            </div>
          </div>

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
              <select
                name="test_type"
                value={formData.test_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Test Type</option>
                <option value="blood">Blood Test</option>
                <option value="urine">Urine Test</option>
                <option value="imaging">Imaging</option>
                <option value="biopsy">Biopsy</option>
                <option value="culture">Culture</option>
                <option value="molecular">Molecular Test</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Test Result *</label>
            <textarea
              name="result"
              value={formData.result}
              onChange={handleChange}
              placeholder="Enter test results in detail..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Normal Range</label>
            <input
              type="text"
              name="normal_range"
              value={formData.normal_range}
              onChange={handleChange}
              placeholder="e.g., WBC: 4.0-11.0, RBC: 4.5-6.0"
            />
          </div>

          <div className="form-group">
            <label>Units</label>
            <input
              type="text"
              name="units"
              value={formData.units}
              onChange={handleChange}
              placeholder="e.g., 10^9/L, 10^12/L, g/dL"
            />
          </div>

          <div className="form-group">
            <label>Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Additional comments or observations..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Uploading...' : 'Upload Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LabTechnicianTestReports;