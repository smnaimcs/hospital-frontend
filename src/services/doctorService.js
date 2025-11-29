// src/services/doctorService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class DoctorService {
  // Get doctor's appointments
  async getAppointments(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/doctor/appointments?${params}`);
    return response;
  }

  // Add availability
  async addAvailability(availabilityData) {
    const response = await axios.post(`${API_BASE_URL}/doctor/availability`, availabilityData);
    return response;
  }

  // Add diagnosis
  async addDiagnosis(diagnosisData) {
    const response = await axios.post(`${API_BASE_URL}/doctor/diagnosis`, diagnosisData);
    return response;
  }

  // Add prescription
  async addPrescription(prescriptionData) {
    const response = await axios.post(`${API_BASE_URL}/doctor/prescriptions`, prescriptionData);
    return response;
  }

  // Get patient medical history
  async getPatientMedicalHistory(patientId) {
    const response = await axios.get(`${API_BASE_URL}/doctor/patients/${patientId}/medical-history`);
    return response;
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}/status`, { status });
    return response;
  }

  // Reschedule appointment
  async rescheduleAppointment(appointmentId, appointmentDate) {
    const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, { 
      appointment_date: appointmentDate 
    });
    return response;
  }

  // Get doctor's availability
  async getAvailability() {
    const response = await axios.get(`${API_BASE_URL}/doctor/availability`);
    return response;
  }
}

export default new DoctorService();