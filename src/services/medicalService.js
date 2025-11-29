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
}

export default new MedicalService();