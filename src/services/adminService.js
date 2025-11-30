// src/services/adminService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AdminService {
  // Dashboard stats
  async getDashboardStats() {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`);
    return response;
  }

  // Users management
  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/admin/users?${params}`);
    return response;
  }

  async updateUser(userId, userData) {
    const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, userData);
    return response;
  }

  async deleteUser(userId) {
    const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
    return response;
  }

  // Appointments management
  async getAppointments(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/admin/appointments?${params}`);
    return response;
  }

  async updateAppointment(appointmentId, appointmentData) {
    const response = await axios.put(`${API_BASE_URL}/admin/appointments/${appointmentId}`, appointmentData);
    return response;
  }

  // Doctor availability
  async getDoctorAvailability(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/admin/doctor-availability?${params}`);
    return response;
  }

  // Notifications
  async getNotifications(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/admin/notifications?${params}`);
    return response;
  }

  async sendNotification(notificationData) {
    const response = await axios.post(`${API_BASE_URL}/admin/notifications`, notificationData);
    return response;
  }

  // Inventory management
  async getMedicines(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/inventory/medicines?${params}`);
    return response;
  }

  async addMedicine(medicineData) {
    const response = await axios.post(`${API_BASE_URL}/inventory/medicines`, medicineData);
    return response;
  }

  async updateMedicineStock(medicineId, stockData) {
    const response = await axios.put(`${API_BASE_URL}/inventory/inventory/${medicineId}/update-stock`, stockData);
    return response;
  }

  async getStockAlerts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/inventory/stock-alerts?${params}`);
    return response;
  }

  async resolveStockAlert(alertId) {
    const response = await axios.put(`${API_BASE_URL}/inventory/stock-alerts/${alertId}/resolve`);
    return response;
  }

  // Billing management
  async createBill(billData) {
    const response = await axios.post(`${API_BASE_URL}/billing/bills`, billData);
    return response;
  }

  async processPayment(billId, paymentData) {
    const response = await axios.post(`${API_BASE_URL}/billing/bills/${billId}/pay`, paymentData);
    return response;
  }

  async addExpense(expenseData) {
    const response = await axios.post(`${API_BASE_URL}/billing/expenses`, expenseData);
    return response;
  }

  async getFinancialReports(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/billing/financial-reports?${params}`);
    return response;
  }

  async getTestReports(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/medical/test-reports?${params}`);
    return response;
  }
}

export default new AdminService();