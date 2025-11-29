// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      setProfile(response);
      setFormData(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Prepare data for API - remove nested structures that shouldn't be sent
    const submitData = { ...formData };
    delete submitData.user; // Remove nested user object
    delete submitData.patient_info; // Remove nested patient info
    delete submitData.message; // Remove API message
    delete submitData.success; // Remove API success flag

    const result = await updateProfile(submitData);
    
    if (result.success) {
      setMessage('Profile updated successfully');
      setEditing(false);
      // No need to call fetchProfile() here because updateProfile in AuthContext already refreshes the user data
    } else {
      setMessage(result.message);
    }
    
    setLoading(false);
  };

  if (!profile) {
    return <div className="loading">Loading profile...</div>;
  }

  // Get the correct role - handle both user structures
  const userRole = user?.role || (user?.user && user.user.role);
  
  // Helper function to get nested values safely
  const getProfileValue = (path) => {
    if (path === 'blood_group' || path === 'insurance_info' || path === 'emergency_contact') {
      return profile.patient_info?.[path] || '';
    }
    return profile[path] || '';
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button 
          onClick={() => setEditing(!editing)}
          className="btn-primary"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select 
              name="gender" 
              value={formData.gender || ''} 
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {userRole === 'patient' && (
            <>
              <div className="form-group">
                <label>Blood Group:</label>
                <select 
                  name="blood_group" 
                  value={formData.blood_group || ''} 
                  onChange={handleChange}
                >
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
                  value={formData.emergency_contact || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Insurance Information:</label>
                <input
                  type="text"
                  name="insurance_info"
                  value={formData.insurance_info || ''}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {userRole === 'doctor' && (
            <>
              <div className="form-group">
                <label>Specialization:</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Years of Experience:</label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Consultation Fee:</label>
                <input
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Qualification:</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>License Number:</label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number || ''}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {userRole === 'staff' && (
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{profile.first_name} {profile.last_name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{profile.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{profile.phone || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Address:</label>
                <span>{profile.address || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Date of Birth:</label>
                <span>{profile.date_of_birth || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Gender:</label>
                <span>{profile.gender || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className="user-role-badge">{userRole}</span>
              </div>
            </div>
          </div>

          {userRole === 'patient' && (
            <div className="profile-section">
              <h3>Medical Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Blood Group:</label>
                  <span>{getProfileValue('blood_group') || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <label>Emergency Contact:</label>
                  <span>{getProfileValue('emergency_contact') || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <label>Insurance Information:</label>
                  <span>{getProfileValue('insurance_info') || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}

          {userRole === 'doctor' && (
            <div className="profile-section">
              <h3>Professional Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Specialization:</label>
                  <span>{profile.specialization || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <label>Years of Experience:</label>
                  <span>{profile.years_of_experience || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <label>Consultation Fee:</label>
                  <span>{profile.consultation_fee ? `$${profile.consultation_fee}` : 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <label>Qualification:</label>
                  <span>{profile.qualification || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <label>License Number:</label>
                  <span>{profile.license_number || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}

          {userRole === 'staff' && profile.department && (
            <div className="profile-section">
              <h3>Staff Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Department:</label>
                  <span>{profile.department || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;