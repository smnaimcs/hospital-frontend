// src/services/staffService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class StaffService {
  // Attendance
  async checkIn() {
    const response = await axios.post(`${API_BASE_URL}/staff/attendance/check-in`);
    return response;
  }

  async checkOut() {
    const response = await axios.post(`${API_BASE_URL}/staff/attendance/check-out`);
    return response;
  }

  async getAttendanceHistory(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/staff/attendance/history?${params}`);
    return response;
  }

  // Leave requests
  async getLeaveRequests() {
    const response = await axios.get(`${API_BASE_URL}/staff/leave-requests`);
    return response;
  }

  async requestLeave(leaveData) {
    const response = await axios.post(`${API_BASE_URL}/staff/leave-requests`, leaveData);
    return response;
  }

  // Test reports (lab technician specific)
  async uploadTestReport(testData) {
    const response = await axios.post(`${API_BASE_URL}/medical/test-reports`, testData);
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

  // Nurse specific functions
  async recordVitalSigns(vitalSignsData) {
    const response = await axios.post(`${API_BASE_URL}/medical/vital-signs`, vitalSignsData);
    return response;
  }

  async getVitalSigns(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/medical/vital-signs?${params}`);
    return response;
  }

  async updatePatientArrival(patientId, status) {
    const response = await axios.put(`${API_BASE_URL}/medical/patient-arrival/${patientId}`, {
      arrival_status: status
    });
    return response;
  }

  async addMedicalRecord(recordData) {
    const response = await axios.post(`${API_BASE_URL}/medical/medical-records`, recordData);
    return response;
  }

  async getMedicalRecords(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/medical/medical-records?${params}`);
    return response;
  }
}

export default new StaffService();