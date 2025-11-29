// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Appointments from './pages/patient/Appointments';
import Doctors from './pages/patient/Doctors';
import MedicalRecords from './pages/patient/MedicalRecords';
import Billing from './pages/patient/Billing';
import Navbar from './components/common/Navbar';
import DoctorSchedule from './pages/doctor/Schedule';
import DoctorPatients from './pages/doctor/Patients';
import DoctorPrescriptions from './pages/doctor/Prescriptions';
import DoctorMedicalRecords from './pages/doctor/MedicalRecords';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              {/* Patient Routes */}
              <Route 
                path="/appointments" 
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctors" 
                element={
                  <ProtectedRoute>
                    <Doctors />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/records" 
                element={
                  <ProtectedRoute>
                    <MedicalRecords />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/billing" 
                element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                } 
              />
              // doctor routes
              <Route 
                path="/schedule" 
                element={
                  <ProtectedRoute>
                    <DoctorSchedule />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patients" 
                element={
                  <ProtectedRoute>
                    <DoctorPatients />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/prescriptions" 
                element={
                  <ProtectedRoute>
                    <DoctorPrescriptions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/medical-records" 
                element={
                  <ProtectedRoute>
                    <DoctorMedicalRecords />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;