// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'patient', // Changed to uppercase default
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    emergency_contact: '',
    insurance_info: '',
    license_number: '',
    specialization: '',
    years_of_experience: '',
    qualification: '',
    consultation_fee: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Filter out empty fields but keep role always
    const submitData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (key === 'role') return true; // Always include role
        return value !== ''; // Filter out other empty fields
      })
    );

    const result = await register(submitData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const renderPatientFields = () => (
    <>
      <div className="form-group">
        <label>Blood Group:</label>
        <select name="blood_group" value={formData.blood_group} onChange={handleChange}>
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Emergency Contact:</label>
        <input
          type="tel"
          name="emergency_contact"
          value={formData.emergency_contact}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Insurance Information:</label>
        <input
          type="text"
          name="insurance_info"
          value={formData.insurance_info}
          onChange={handleChange}
        />
      </div>
    </>
  );

  const renderDoctorFields = () => (
    <>
      <div className="form-group">
        <label>License Number:</label>
        <input
          type="text"
          name="license_number"
          value={formData.license_number}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Specialization:</label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Years of Experience:</label>
        <input
          type="number"
          name="years_of_experience"
          value={formData.years_of_experience}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Qualification:</label>
        <input
          type="text"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Consultation Fee:</label>
        <input
          type="number"
          name="consultation_fee"
          value={formData.consultation_fee}
          onChange={handleChange}
        />
      </div>
    </>
  );

  const renderStaffFields = () => (
    <div className="form-group">
      <label>Department:</label>
      <input
        type="text"
        name="department"
        value={formData.department}
        onChange={handleChange}
        required
      />
    </div>
  );

  const renderLabTechnicianFields = () => (
    <>
      <div className="form-group">
        <label>Employee ID:</label>
        <input
          type="text"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Department:</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Staff Type:</label>
        <input
          type="text"
          name="staff_type"
          value={formData.staff_type}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );

  const renderNurseFields = () => (
    <>
      <div className="form-group">
        <label>Employee ID:</label>
        <input
          type="text"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Department:</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Staff Type:</label>
        <input
          type="text"
          name="staff_type"
          value={formData.staff_type}
          onChange={handleChange}
          defaultValue="nurse" // Set default to "nurse"
          required
        />
      </div>
    </>
  );

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register for Hospital System</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="lab_technician">Lab Technician</option>
              <option value="nurse">Nurse</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          {formData.role === 'patient' && renderPatientFields()}
          {formData.role === 'doctor' && renderDoctorFields()}
          {formData.role === 'staff' && renderStaffFields()}
          {formData.role === 'lab_technician' && renderLabTechnicianFields()}
          {formData.role === 'nurse' && renderNurseFields()}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;