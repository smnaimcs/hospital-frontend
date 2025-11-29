// src/services/medicalService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class MedicalService {
  // Get test reports
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

  // Get vital signs
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

  // Upload test report (doctor specific)
  async uploadTestReport(testData) {
    const response = await axios.post(`${API_BASE_URL}/medical/test-reports`, testData);
    return response;
  }

  // Record vital signs
  async recordVitalSigns(vitalData) {
    const response = await axios.post(`${API_BASE_URL}/medical/vital-signs`, vitalData);
    return response;
  }

  // Add medical record
  async addMedicalRecord(recordData) {
    const response = await axios.post(`${API_BASE_URL}/medical/medical-records`, recordData);
    return response;
  }

  // Get medical records
  async getMedicalRecords(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/medical-records?${params}`);
    return response;
  }
}

export default new MedicalService();