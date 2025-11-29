// src/pages/patient/Billing.jsx
import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService';

function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentData, setPaymentData] = useState({
    payment_method: 'cash',
    amount: 0
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await patientService.getBills();
      setBills(response.bills || []);
    } catch (error) {
      setError('Failed to fetch bills');
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = async (bill) => {
    setSelectedBill(bill);
    setPaymentData({
      payment_method: 'cash',
      amount: bill.final_amount
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBill) return;

    try {
      await patientService.payBill(selectedBill.id, paymentData);
      alert('Payment processed successfully!');
      setSelectedBill(null);
      fetchBills(); // Refresh bills list
    } catch (error) {
      alert('Failed to process payment');
      console.error('Error processing payment:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'status-pending',
      paid: 'status-completed',
      overdue: 'status-cancelled'
    };
    
    return <span className={`status-badge ${statusColors[status] || ''}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading bills...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Bills</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bills.length === 0 ? (
        <div className="empty-state">
          <h3>No bills found</h3>
          <p>You don't have any bills at the moment.</p>
        </div>
      ) : (
        <div className="bills-list">
          {bills.map((bill) => (
            <div key={bill.id} className="bill-card">
              <div className="bill-header">
                <div>
                  <h3>{bill.bill_number}</h3>
                  <p className="bill-date">Due: {formatDate(bill.due_date)}</p>
                </div>
                {getStatusBadge(bill.status)}
              </div>
              
              <div className="bill-details">
                <div className="amount-breakdown">
                  <div className="amount-item">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(bill.total_amount)}</span>
                  </div>
                  <div className="amount-item">
                    <span>Tax:</span>
                    <span>{formatCurrency(bill.tax_amount)}</span>
                  </div>
                  <div className="amount-item">
                    <span>Discount:</span>
                    <span>-{formatCurrency(bill.discount_amount)}</span>
                  </div>
                  <div className="amount-item total">
                    <span>Final Amount:</span>
                    <span>{formatCurrency(bill.final_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="bill-actions">
                {bill.status === 'pending' && (
                  <button 
                    onClick={() => handlePayBill(bill)}
                    className="btn-primary"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {selectedBill && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Pay Bill</h2>
              <button 
                onClick={() => setSelectedBill(null)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="bill-summary">
                <h4>Bill Summary</h4>
                <p><strong>Bill Number:</strong> {selectedBill.bill_number}</p>
                <p><strong>Amount Due:</strong> {formatCurrency(selectedBill.final_amount)}</p>
                <p><strong>Due Date:</strong> {formatDate(selectedBill.due_date)}</p>
              </div>

              <div className="form-group">
                <label>Payment Method:</label>
                <select
                  name="payment_method"
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value})}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value)})}
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setSelectedBill(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;