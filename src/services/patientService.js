// src/services/patientService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class PatientService {
  // Get all doctors with optional filters
  async getDoctors(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/patient/doctors?${params}`);
    return response;
  }

   // Book a new appointment
  async bookAppointment(appointmentData) {
    const response = await axios.post(`${API_BASE_URL}/patient/appointments`, appointmentData);
    return response;
  }

  // Get patient appointments
  async getAppointments(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/patient/appointments?${params}`);
    return response;
  }

  // Cancel an appointment
  async cancelAppointment(appointmentId) {
    const response = await axios.put(`${API_BASE_URL}/patient/appointments/${appointmentId}/cancel`);
    return response;
  }

  // Get patient bills
  async getBills() {
    const response = await axios.get(`${API_BASE_URL}/patient/bills`);
    return response;
  }

  // Pay a bill
  async payBill(billId, paymentData) {
    const response = await axios.post(`${API_BASE_URL}/billing/bills/${billId}/pay`, paymentData);
    return response;
  }
}

export default new PatientService();