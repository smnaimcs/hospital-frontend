// src/pages/admin/Inventory.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

function AdminInventory() {
  const [medicines, setMedicines] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('medicines');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    low_stock: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    if (activeTab === 'medicines') {
      fetchMedicines();
    } else {
      fetchStockAlerts();
    }
  }, [activeTab, filters]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMedicines(filters);
      setMedicines(response.medicines || []);
    } catch (error) {
      setError('Failed to fetch medicines');
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStockAlerts({ resolved: false });
      setStockAlerts(response.alerts || []);
    } catch (error) {
      setError('Failed to fetch stock alerts');
      console.error('Error fetching stock alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (medicineData) => {
    try {
      await adminService.addMedicine(medicineData);
      alert('Medicine added successfully');
      setShowAddModal(false);
      fetchMedicines();
    } catch (error) {
      alert('Failed to add medicine');
      console.error('Error adding medicine:', error);
    }
  };

  const handleUpdateStock = async (medicineId, stockData) => {
    try {
      await adminService.updateMedicineStock(medicineId, stockData);
      alert('Stock updated successfully');
      setShowStockModal(false);
      setSelectedMedicine(null);
      fetchMedicines();
      fetchStockAlerts();
    } catch (error) {
      alert('Failed to update stock');
      console.error('Error updating stock:', error);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await adminService.resolveStockAlert(alertId);
      alert('Stock alert resolved');
      fetchStockAlerts();
    } catch (error) {
      alert('Failed to resolve alert');
      console.error('Error resolving alert:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getStockStatus = (inventory) => {
    if (!inventory) return 'unknown';
    
    if (inventory.current_stock <= inventory.minimum_stock) {
      return 'low';
    } else if (inventory.current_stock >= inventory.maximum_stock * 0.8) {
      return 'high';
    } else {
      return 'normal';
    }
  };

  const getStockStatusBadge = (inventory) => {
    const status = getStockStatus(inventory);
    const statusColors = {
      low: 'status-cancelled',
      normal: 'status-completed',
      high: 'status-confirmed',
      unknown: 'status-pending'
    };
    
    return <span className={`status-badge ${statusColors[status]}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add New Medicine
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'medicines' ? 'active' : ''}`}
          onClick={() => setActiveTab('medicines')}
        >
          Medicines
          {stockAlerts.length > 0 && (
            <span className="tab-badge">{stockAlerts.length}</span>
          )}
        </button>
        <button 
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Stock Alerts
          {stockAlerts.length > 0 && (
            <span className="tab-badge alert">{stockAlerts.length}</span>
          )}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tab-content">
        {activeTab === 'medicines' ? (
          <>
            {/* Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <input
                  type="text"
                  name="search"
                  placeholder="Search medicines..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="search-input"
                />
              </div>
              <div className="filter-group">
                <select 
                  name="category" 
                  value={filters.category} 
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup</option>
                  <option value="injection">Injection</option>
                  <option value="ointment">Ointment</option>
                </select>
              </div>
              <div className="filter-group">
                <select 
                  name="low_stock" 
                  value={filters.low_stock} 
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Stock</option>
                  <option value="true">Low Stock Only</option>
                </select>
              </div>
            </div>

            {/* Medicines List */}
            {medicines.length === 0 ? (
              <div className="empty-state">
                <h3>No medicines found</h3>
                <p>No medicines match your current filters.</p>
              </div>
            ) : (
              <div className="medicines-grid">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="medicine-card">
                    <div className="medicine-header">
                      <h3>{medicine.name}</h3>
                      {getStockStatusBadge(medicine.inventory)}
                    </div>
                    
                    <div className="medicine-details">
                      <div className="detail-item">
                        <label>Generic Name:</label>
                        <span>{medicine.generic_name}</span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Category:</label>
                        <span>{medicine.category}</span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Manufacturer:</label>
                        <span>{medicine.manufacturer}</span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Price:</label>
                        <span>${medicine.unit_price}</span>
                      </div>

                      {medicine.inventory && (
                        <>
                          <div className="detail-item">
                            <label>Current Stock:</label>
                            <span className={getStockStatus(medicine.inventory) === 'low' ? 'low-stock' : ''}>
                              {medicine.inventory.current_stock}
                            </span>
                          </div>
                          
                          <div className="detail-item">
                            <label>Min/Max:</label>
                            <span>{medicine.inventory.minimum_stock} / {medicine.inventory.maximum_stock}</span>
                          </div>
                          
                          <div className="detail-item">
                            <label>Shelf Location:</label>
                            <span>{medicine.inventory.shelf_location}</span>
                          </div>
                          
                          <div className="detail-item">
                            <label>Expiry:</label>
                            <span>{formatDate(medicine.expiry_date)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="medicine-actions">
                      <button 
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setShowStockModal(true);
                        }}
                        className="btn-primary"
                      >
                        Update Stock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Stock Alerts Tab */
          <div className="alerts-list">
            {stockAlerts.length === 0 ? (
              <div className="empty-state">
                <h3>No stock alerts</h3>
                <p>All medicines are sufficiently stocked.</p>
              </div>
            ) : (
              stockAlerts.map((alert) => (
                <div key={alert.id} className="alert-card">
                  <div className="alert-header">
                    <div className="alert-icon">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="alert-content">
                      <h4>{alert.message}</h4>
                      <p className="alert-date">Created: {formatDate(alert.created_at)}</p>
                    </div>
                  </div>
                  <div className="alert-actions">
                    <button 
                      onClick={() => handleResolveAlert(alert.id)}
                      className="btn-success"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <AddMedicineModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMedicine}
        />
      )}

      {/* Update Stock Modal */}
      {showStockModal && selectedMedicine && (
        <UpdateStockModal
          medicine={selectedMedicine}
          onClose={() => {
            setShowStockModal(false);
            setSelectedMedicine(null);
          }}
          onSave={handleUpdateStock}
        />
      )}
    </div>
  );
}

// Add Medicine Modal Component
function AddMedicineModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    manufacturer: '',
    batch_number: '',
    expiry_date: '',
    unit_price: '',
    prescription_required: false,
    initial_stock: '',
    minimum_stock: '',
    maximum_stock: '',
    shelf_location: '',
    description: '',
    dosage_instructions: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.generic_name || !formData.category) {
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
          <h2>Add New Medicine</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="medicine-form">
          <div className="form-row">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Paracetamol 500mg"
                required
              />
            </div>
            <div className="form-group">
              <label>Generic Name *</label>
              <input
                type="text"
                name="generic_name"
                value={formData.generic_name}
                onChange={handleChange}
                placeholder="e.g., Acetaminophen"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="ointment">Ointment</option>
                <option value="cream">Cream</option>
                <option value="drops">Drops</option>
              </select>
            </div>
            <div className="form-group">
              <label>Manufacturer *</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g., Pharma Co"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Batch Number *</label>
              <input
                type="text"
                name="batch_number"
                value={formData.batch_number}
                onChange={handleChange}
                placeholder="e.g., BATCH123"
                required
              />
            </div>
            <div className="form-group">
              <label>Expiry Date *</label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                placeholder="e.g., 5.99"
                required
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="prescription_required"
                  checked={formData.prescription_required}
                  onChange={handleChange}
                />
                Prescription Required
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Initial Stock *</label>
              <input
                type="number"
                name="initial_stock"
                value={formData.initial_stock}
                onChange={handleChange}
                placeholder="e.g., 100"
                required
              />
            </div>
            <div className="form-group">
              <label>Minimum Stock *</label>
              <input
                type="number"
                name="minimum_stock"
                value={formData.minimum_stock}
                onChange={handleChange}
                placeholder="e.g., 20"
                required
              />
            </div>
            <div className="form-group">
              <label>Maximum Stock *</label>
              <input
                type="number"
                name="maximum_stock"
                value={formData.maximum_stock}
                onChange={handleChange}
                placeholder="e.g., 500"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Shelf Location</label>
            <input
              type="text"
              name="shelf_location"
              value={formData.shelf_location}
              onChange={handleChange}
              placeholder="e.g., A1-25"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Medicine description..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Dosage Instructions</label>
            <textarea
              name="dosage_instructions"
              value={formData.dosage_instructions}
              onChange={handleChange}
              placeholder="Dosage instructions..."
              rows="2"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Update Stock Modal Component
function UpdateStockModal({ medicine, onClose, onSave }) {
  const [formData, setFormData] = useState({
    quantity: '',
    operation: 'add'
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
    
    if (!formData.quantity || formData.quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    setLoading(true);
    await onSave(medicine.id, formData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Update Stock - {medicine.name}</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <div className="current-stock-info">
          <p><strong>Current Stock:</strong> {medicine.inventory?.current_stock || 0}</p>
          <p><strong>Min/Max:</strong> {medicine.inventory?.minimum_stock || 0} / {medicine.inventory?.maximum_stock || 0}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Operation *</label>
            <select
              name="operation"
              value={formData.operation}
              onChange={handleChange}
              required
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="set">Set Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminInventory;