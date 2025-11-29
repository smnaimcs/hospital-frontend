// // src/pages/patient/Doctors.jsx
// import React, { useState, useEffect } from 'react';
// import patientService from '../../services/patientService';

// function Doctors() {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     search: '',
//     specialization: ''
//   });

//   useEffect(() => {
//     fetchDoctors();
//   }, [filters]);

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const response = await patientService.getDoctors(filters);
//       setDoctors(response.doctors || []);
//     } catch (error) {
//       setError('Failed to fetch doctors');
//       console.error('Error fetching doctors:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchDoctors();
//   };

//   const getAvailabilityBadge = (isAvailable) => {
//     return isAvailable ? 
//       <span className="status-badge status-available">Available</span> :
//       <span className="status-badge status-unavailable">Unavailable</span>;
//   };

//   return (
//     <div className="page-container">
//       <div className="page-header">
//         <h1>Find Doctors</h1>
//       </div>

//       {/* Search and Filters */}
//       <div className="search-filters">
//         <form onSubmit={handleSearch} className="search-form">
//           <div className="form-row">
//             <div className="form-group">
//               <input
//                 type="text"
//                 name="search"
//                 placeholder="Search by doctor name..."
//                 value={filters.search}
//                 onChange={handleFilterChange}
//                 className="search-input"
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 name="specialization"
//                 placeholder="Specialization..."
//                 value={filters.specialization}
//                 onChange={handleFilterChange}
//                 className="search-input"
//               />
//             </div>
//             <button type="submit" className="btn-primary">
//               Search
//             </button>
//           </div>
//         </form>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       {loading ? (
//         <div className="loading">Loading doctors...</div>
//       ) : doctors.length === 0 ? (
//         <div className="empty-state">
//           <h3>No doctors found</h3>
//           <p>Try adjusting your search criteria.</p>
//         </div>
//       ) : (
//         <div className="doctors-grid">
//           {doctors.map((doctor) => (
//             <div key={doctor.id} className="doctor-card">
//               <div className="doctor-header">
//                 <h3>Dr. {doctor.user.first_name} {doctor.user.last_name}</h3>
//                 {getAvailabilityBadge(doctor.is_available)}
//               </div>
              
//               <div className="doctor-details">
//                 <div className="detail-item">
//                   <label>Specialization:</label>
//                   <span>{doctor.specialization}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Qualification:</label>
//                   <span>{doctor.qualification}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Experience:</label>
//                   <span>{doctor.years_of_experience} years</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Consultation Fee:</label>
//                   <span className="fee">${doctor.consultation_fee}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Contact:</label>
//                   <span>{doctor.user.phone || 'Not provided'}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Address:</label>
//                   <span>{doctor.user.address || 'Not provided'}</span>
//                 </div>
//               </div>

//               <div className="doctor-actions">
//                 <button className="btn-primary" disabled={!doctor.is_available}>
//                   Book Appointment
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Doctors;

// src/pages/patient/Doctors.jsx
import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    specialization: ''
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctor_id: '',
    appointment_date: '',
    reason: '',
    symptoms: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await patientService.getDoctors(filters);
      setDoctors(response.doctors || []);
    } catch (error) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingData({
      doctor_id: doctor.id,
      appointment_date: '',
      reason: '',
      symptoms: ''
    });
    setBookingModal(true);
    setBookingSuccess('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.appointment_date || !bookingData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await patientService.bookAppointment(bookingData);
      setBookingSuccess('Appointment booked successfully!');
      setTimeout(() => {
        setBookingModal(false);
        setBookingSuccess('');
        // Refresh doctors list to update availability if needed
        fetchDoctors();
      }, 2000);
    } catch (error) {
      setError('Failed to book appointment');
      console.error('Error booking appointment:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const getAvailabilityBadge = (isAvailable) => {
    return isAvailable ? 
      <span className="status-badge status-available">Available</span> :
      <span className="status-badge status-unavailable">Unavailable</span>;
  };

  const getNextAvailableTimeSlots = () => {
    const today = new Date();
    const slots = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Generate time slots from 9 AM to 5 PM
      for (let hour = 9; hour <= 17; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const dateTimeString = `${date.toISOString().split('T')[0]}T${timeString}`;
        slots.push(dateTimeString);
      }
    }
    
    return slots;
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find Doctors</h1>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="search"
                placeholder="Search by doctor name..."
                value={filters.search}
                onChange={handleFilterChange}
                className="search-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="specialization"
                placeholder="Specialization..."
                value={filters.specialization}
                onChange={handleFilterChange}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <h3>No doctors found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-header">
                <h3>Dr. {doctor.user.first_name} {doctor.user.last_name}</h3>
                {getAvailabilityBadge(doctor.is_available)}
              </div>
              
              <div className="doctor-details">
                <div className="detail-item">
                  <label>Specialization:</label>
                  <span>{doctor.specialization}</span>
                </div>
                
                <div className="detail-item">
                  <label>Qualification:</label>
                  <span>{doctor.qualification}</span>
                </div>
                
                <div className="detail-item">
                  <label>Experience:</label>
                  <span>{doctor.years_of_experience} years</span>
                </div>
                
                <div className="detail-item">
                  <label>Consultation Fee:</label>
                  <span className="fee">${doctor.consultation_fee}</span>
                </div>
                
                <div className="detail-item">
                  <label>Contact:</label>
                  <span>{doctor.user.phone || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <label>Address:</label>
                  <span>{doctor.user.address || 'Not provided'}</span>
                </div>

                <div className="detail-item">
                  <label>License Number:</label>
                  <span>{doctor.license_number}</span>
                </div>
              </div>

              <div className="doctor-actions">
                <button 
                  onClick={() => handleBookAppointment(doctor)}
                  className="btn-primary" 
                  disabled={!doctor.is_available}
                >
                  {doctor.is_available ? 'Book Appointment' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button 
                onClick={() => setBookingModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            
            {bookingSuccess ? (
              <div className="success-message">
                <h3>Success!</h3>
                <p>{bookingSuccess}</p>
                <p>You will be redirected shortly...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="doctor-info">
                  <h4>Doctor Information</h4>
                  <p><strong>Name:</strong> Dr. {selectedDoctor.user.first_name} {selectedDoctor.user.last_name}</p>
                  <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                  <p><strong>Fee:</strong> ${selectedDoctor.consultation_fee}</p>
                </div>

                <div className="form-group">
                  <label>Appointment Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="appointment_date"
                    value={bookingData.appointment_date}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                  <small>Select a date and time for your appointment</small>
                <div className="form-group">
                <label>Quick Time Slots (Optional)</label>
                <div className="time-slots">
                    {getNextAvailableTimeSlots().slice(0, 6).map((slot) => (
                    <button
                        key={slot}
                        type="button"
                        className={`time-slot ${
                        bookingData.appointment_date === slot ? 'selected' : ''
                        }`}
                        onClick={() => setBookingData({
                        ...bookingData,
                        appointment_date: slot
                        })}
                    >
                        {formatDateTime(slot)}
                    </button>
                    ))}
                </div>
                <small>Click on a time slot to select it quickly</small>
                </div>
                </div>

                <div className="form-group">
                  <label>Reason for Visit *</label>
                  <textarea
                    name="reason"
                    value={bookingData.reason}
                    onChange={handleBookingChange}
                    placeholder="Please describe the reason for your visit..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Symptoms (Optional)</label>
                  <textarea
                    name="symptoms"
                    value={bookingData.symptoms}
                    onChange={handleBookingChange}
                    placeholder="Describe any symptoms you're experiencing..."
                    rows="3"
                  />
                </div>

                <div className="booking-summary">
                  <h4>Appointment Summary</h4>
                  <div className="summary-item">
                    <span>Consultation Fee:</span>
                    <span>${selectedDoctor.consultation_fee}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total Amount:</span>
                    <span>${selectedDoctor.consultation_fee}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => setBookingModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={bookingLoading}
                    className="btn-primary"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;