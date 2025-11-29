// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.setupInterceptors();
  }

  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token) {
    this.token = token;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  async login(email, password) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    return response;
  }

  async register(userData) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response;
  }

  async getProfile() {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response;
  }

  async updateProfile(profileData) {
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
    return response;
  }

  getCurrentUser() {
    // In a real app, you might want to decode the JWT token
    // or make an API call to verify the token
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Simple decode (in production, use a proper JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email, // You might need to store this in localStorage
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('token');
  }
}

export default new AuthService();