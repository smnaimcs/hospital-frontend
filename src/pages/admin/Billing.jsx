// src/pages/admin/Billing.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import patientService from '../../services/patientService';

function AdminBilling() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bills');
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    fetchBills();
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchBills = async () => {
    try {
      // Since we don't have a direct admin bills endpoint, we'll use patient bills for demo
      // In a real app, you'd have an admin endpoint for all bills
      const response = await patientService.getBills();
      setBills(response.bills || []);
    } catch (error) {
      setError('Failed to fetch bills');
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await adminService.getUsers({ role: 'PATIENT' });
      setPatients(response.users || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await adminService.getAppointments({ status: 'completed' });
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCreateBill = async (billData) => {
    try {
      await adminService.createBill(billData);
      alert('Bill created successfully');
      setShowCreateBillModal(false);
      fetchBills();
    } catch (error) {
      alert('Failed to create bill');
      console.error('Error creating bill:', error);
    }
  };

  const handleProcessPayment = async (paymentData) => {
    try {
      await adminService.processPayment(selectedBill.id, paymentData);
      alert('Payment processed successfully');
      setShowPaymentModal(false);
      setSelectedBill(null);
      fetchBills();
    } catch (error) {
      alert('Failed to process payment');
      console.error('Error processing payment:', error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await adminService.addExpense(expenseData);
      alert('Expense recorded successfully');
      setShowExpenseModal(false);
    } catch (error) {
      alert('Failed to record expense');
      console.error('Error recording expense:', error);
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
    return <div className="loading">Loading billing data...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Billing Management</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowCreateBillModal(true)}
            className="btn-primary"
          >
            Create Bill
          </button>
          <button 
            onClick={() => setShowExpenseModal(true)}
            className="btn-secondary"
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveTab('bills')}
        >
          Bills & Payments
        </button>
        <button 
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tab-content">
        {activeTab === 'bills' ? (
          <div className="bills-section">
            <h2>All Bills</h2>
            {bills.length === 0 ? (
              <div className="empty-state">
                <h3>No bills found</h3>
                <p>No bills have been created yet.</p>
              </div>
            ) : (
              <div className="bills-list">
                {bills.map((bill) => (
                  <div key={bill.id} className="bill-card">
                    <div className="bill-header">
                      <div>
                        <h3>{bill.bill_number}</h3>
                        <p className="bill-patient">Patient ID: {bill.patient_id}</p>
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

                      <div className="bill-meta">
                        <div className="meta-item">
                          <label>Due Date:</label>
                          <span>{formatDate(bill.due_date)}</span>
                        </div>
                        <div className="meta-item">
                          <label>Created:</label>
                          <span>{formatDate(bill.created_at)}</span>
                        </div>
                        {bill.appointment_id && (
                          <div className="meta-item">
                            <label>Appointment:</label>
                            <span>#{bill.appointment_id}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bill-actions">
                      {bill.status === 'pending' && (
                        <button 
                          onClick={() => {
                            setSelectedBill(bill);
                            setShowPaymentModal(true);
                          }}
                          className="btn-primary"
                        >
                          Process Payment
                        </button>
                      )}
                      <button className="btn-secondary">
                        Print Bill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="expenses-section">
            <h2>Expense Management</h2>
            <div className="info-card">
              <h4>Expense Tracking</h4>
              <p>Use this section to record and track hospital expenses. All expenses will be included in financial reports.</p>
            </div>
            {/* Expenses list would go here */}
            <div className="empty-state">
              <h3>No expenses recorded</h3>
              <p>Click "Add Expense" to start recording expenses.</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Bill Modal */}
      {showCreateBillModal && (
        <CreateBillModal
          patients={patients}
          appointments={appointments}
          onClose={() => setShowCreateBillModal(false)}
          onSave={handleCreateBill}
        />
      )}

      {/* Process Payment Modal */}
      {showPaymentModal && selectedBill && (
        <ProcessPaymentModal
          bill={selectedBill}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBill(null);
          }}
          onSave={handleProcessPayment}
        />
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSave={handleAddExpense}
        />
      )}
    </div>
  );
}

// Create Bill Modal Component
function CreateBillModal({ patients, appointments, onClose, onSave }) {
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_id: '',
    total_amount: '',
    tax_amount: '0',
    discount_amount: '0',
    due_date: '',
    items: [
      { description: '', quantity: 1, unit_price: '', type: 'service' }
    ]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: '', type: 'service' }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: newItems
      });
    }
  };

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0);
    }, 0);
    
    const tax = parseFloat(formData.tax_amount) || 0;
    const discount = parseFloat(formData.discount_amount) || 0;
    
    return itemsTotal + tax - discount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_id || !formData.total_amount) {
      alert('Please fill in all required fields');
      return;
    }

    const billData = {
      ...formData,
      total_amount: parseFloat(formData.total_amount),
      tax_amount: parseFloat(formData.tax_amount),
      discount_amount: parseFloat(formData.discount_amount),
      final_amount: calculateTotal()
    };

    setLoading(true);
    await onSave(billData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>Create New Bill</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="bill-form">
          <div className="form-row">
            <div className="form-group">
              <label>Patient *</label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} ({patient.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Appointment (Optional)</label>
              <select
                name="appointment_id"
                value={formData.appointment_id}
                onChange={handleChange}
              >
                <option value="">Select Appointment</option>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    #{appointment.id} - {appointment.patient.user.first_name} {appointment.patient.user.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="bill-items-section">
            <h4>Bill Items</h4>
            {formData.items.map((item, index) => (
              <div key={index} className="bill-item">
                <div className="form-row">
                  <div className="form-group">
                    <label>Description *</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="e.g., Consultation Fee"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                    >
                      <option value="service">Service</option>
                      <option value="test">Test</option>
                      <option value="medicine">Medicine</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Total</label>
                    <input
                      type="text"
                      value={`$${((parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}`}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <div className="form-group">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn-danger"
                        style={{ marginTop: '1.5rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addItem} className="btn-secondary">
              Add Another Item
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tax Amount ($)</label>
              <input
                type="number"
                step="0.01"
                name="tax_amount"
                value={formData.tax_amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Discount Amount ($)</label>
              <input
                type="number"
                step="0.01"
                name="discount_amount"
                value={formData.discount_amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bill-summary">
            <h4>Bill Summary</h4>
            <div className="summary-item">
              <span>Items Total:</span>
              <span>${formData.items.reduce((sum, item) => sum + ((parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 1)), 0).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>${formData.tax_amount}</span>
            </div>
            <div className="summary-item">
              <span>Discount:</span>
              <span>-${formData.discount_amount}</span>
            </div>
            <div className="summary-item total">
              <span>Final Amount:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Process Payment Modal Component
function ProcessPaymentModal({ bill, onClose, onSave }) {
  const [formData, setFormData] = useState({
    payment_method: 'cash',
    amount: bill.final_amount
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
    
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount');
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
          <h2>Process Payment</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <div className="payment-info">
          <h4>Bill Information</h4>
          <p><strong>Bill Number:</strong> {bill.bill_number}</p>
          <p><strong>Amount Due:</strong> ${bill.final_amount}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="online">Online Payment</option>
              <option value="insurance">Insurance</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount ($) *</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              max={bill.final_amount}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Expense Modal Component
function AddExpenseModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    category: 'medical_supplies',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    department: 'general',
    receipt_url: ''
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
    
    if (!formData.description || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    setLoading(true);
    await onSave(expenseData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Record Expense</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="medical_supplies">Medical Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="medicines">Medicines</option>
              <option value="staff_salary">Staff Salary</option>
              <option value="utilities">Utilities</option>
              <option value="maintenance">Maintenance</option>
              <option value="office_supplies">Office Supplies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the expense..."
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label>Expense Date *</label>
              <input
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="surgery">Surgery</option>
              <option value="cardiology">Cardiology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="emergency">Emergency</option>
              <option value="administration">Administration</option>
            </select>
          </div>

          <div className="form-group">
            <label>Receipt URL (Optional)</label>
            <input
              type="url"
              name="receipt_url"
              value={formData.receipt_url}
              onChange={handleChange}
              placeholder="https://receipts.com/123"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Recording...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminBilling;