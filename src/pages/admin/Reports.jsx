// src/pages/admin/Reports.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

function AdminReports() {
  const [financialReports, setFinancialReports] = useState({});
  const [testReports, setTestReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('financial');
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    if (activeTab === 'financial') {
      fetchFinancialReports();
    } else {
      fetchTestReports();
    }
  }, [activeTab, filters]);

  const fetchFinancialReports = async () => {
    try {
      setLoading(true);
      const response = await adminService.getFinancialReports(filters);
      setFinancialReports(response);
    } catch (error) {
      setError('Failed to fetch financial reports');
      console.error('Error fetching financial reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestReports = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTestReports();
      setTestReports(response.test_reports || []);
    } catch (error) {
      setError('Failed to fetch test reports');
      console.error('Error fetching test reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial Reports
        </button>
        <button 
          className={`tab ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => setActiveTab('test')}
        >
          Test Reports
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tab-content">
        {activeTab === 'financial' ? (
          <div className="financial-reports">
            {/* Date Filters */}
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

            {/* Financial Overview */}
            <div className="financial-overview">
              <h2>Financial Overview</h2>
              <div className="financial-cards">
                <div className="financial-card revenue">
                  <div className="financial-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <div className="financial-content">
                    <h3>{formatCurrency(financialReports.total_revenue || 0)}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>

                <div className="financial-card expenses">
                  <div className="financial-icon">
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div className="financial-content">
                    <h3>{formatCurrency(financialReports.total_expenses || 0)}</h3>
                    <p>Total Expenses</p>
                  </div>
                </div>

                <div className="financial-card profit">
                  <div className="financial-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="financial-content">
                    <h3>{formatCurrency(financialReports.net_profit || 0)}</h3>
                    <p>Net Profit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Expenses */}
            {financialReports.department_expenses && financialReports.department_expenses.length > 0 && (
              <div className="department-expenses">
                <h3>Expenses by Department</h3>
                <div className="expenses-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Total Expenses</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialReports.department_expenses.map((dept, index) => (
                        <tr key={index}>
                          <td>{dept.department}</td>
                          <td>{formatCurrency(dept.total)}</td>
                          <td>
                            {((dept.total / (financialReports.total_expenses || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Report Period */}
            {financialReports.report_period && (
              <div className="report-period">
                <h3>Report Period</h3>
                <p>
                  {financialReports.report_period.start_date 
                    ? formatDate(financialReports.report_period.start_date) 
                    : 'All time'} 
                  {' to '}
                  {financialReports.report_period.end_date 
                    ? formatDate(financialReports.report_period.end_date) 
                    : 'Present'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="test-reports">
            <h2>Test Reports</h2>
            {testReports.length === 0 ? (
              <div className="empty-state">
                <h3>No test reports found</h3>
                <p>No test reports are available.</p>
              </div>
            ) : (
              <div className="test-reports-list">
                {testReports.map((report) => (
                  <div key={report.id} className="test-report-card">
                    <div className="test-report-header">
                      <h3>{report.test_name}</h3>
                      <span className={`status-badge ${report.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <div className="test-report-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <label>Patient ID:</label>
                          <span>{report.patient_id}</span>
                        </div>
                        <div className="detail-item">
                          <label>Type:</label>
                          <span>{report.test_type}</span>
                        </div>
                      </div>
                      
                      <div className="detail-row">
                        <div className="detail-item">
                          <label>Result:</label>
                          <span className={report.result === 'Normal' ? 'normal-result' : 'abnormal-result'}>
                            {report.result}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Completed:</label>
                          <span>{formatDate(report.completed_date)}</span>
                        </div>
                      </div>

                      {report.comments && (
                        <div className="detail-item">
                          <label>Comments:</label>
                          <span>{report.comments}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;