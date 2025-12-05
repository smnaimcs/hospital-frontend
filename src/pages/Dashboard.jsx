// // src/pages/Dashboard.jsx
// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';

// function Dashboard() {
//   const { user } = useAuth();

//   const renderPatientDashboard = () => (
//     <div className="dashboard">
//       <h2>Patient Dashboard</h2>
//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>My Appointments</h3>
//           <p>View and manage your appointments</p>
//           <Link to="/appointments" className="btn-secondary">View Appointments</Link>
//         </div>
//         <div className="card">
//           <h3>Medical Records</h3>
//           <p>Access your medical history</p>
//           <Link to="/records" className="btn-secondary">View Records</Link>
//         </div>
//         <div className="card">
//           <h3>Find Doctors</h3>
//           <p>Book appointments with specialists</p>
//           <Link to="/doctors" className="btn-secondary">Find Doctors</Link>
//         </div>
//       </div>
//     </div>
//   );

//   const renderDoctorDashboard = () => (
//     <div className="dashboard">
//       <h2>Doctor Dashboard</h2>
//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>Appointment Schedule</h3>
//           <p>Manage your appointments</p>
//           <Link to="/schedule" className="btn-secondary">View Schedule</Link>
//         </div>
//         <div className="card">
//           <h3>Patient Records</h3>
//           <p>Access patient medical records</p>
//           <Link to="/patients" className="btn-secondary">View Patients</Link>
//         </div>
//         <div className="card">
//           <h3>Prescriptions</h3>
//           <p>Write and manage prescriptions</p>
//           <Link to="/prescriptions" className="btn-secondary">Manage Prescriptions</Link>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStaffDashboard = () => (
//     <div className="dashboard">
//       <h2>Staff Dashboard</h2>
//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>Appointment Management</h3>
//           <p>Manage all appointments</p>
//           <Link to="/appointments" className="btn-secondary">Manage Appointments</Link>
//         </div>
//         <div className="card">
//           <h3>Patient Management</h3>
//           <p>Handle patient registrations</p>
//           <Link to="/patients" className="btn-secondary">Manage Patients</Link>
//         </div>
//         <div className="card">
//           <h3>Billing</h3>
//           <p>Handle billing and payments</p>
//           <Link to="/billing" className="btn-secondary">Manage Billing</Link>
//         </div>
//       </div>
//     </div>
//   );

//   const renderAdminDashboard = () => (
//     <div className="dashboard">
//       <h2>Admin Dashboard</h2>
//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>User Management</h3>
//           <p>Manage all users and permissions</p>
//           <Link to="/users" className="btn-secondary">Manage Users</Link>
//         </div>
//         <div className="card">
//           <h3>System Settings</h3>
//           <p>Configure system settings</p>
//           <Link to="/settings" className="btn-secondary">System Settings</Link>
//         </div>
//         <div className="card">
//           <h3>Reports</h3>
//           <p>View system reports and analytics</p>
//           <Link to="/reports" className="btn-secondary">View Reports</Link>
//         </div>
//       </div>
//     </div>
//   );

//   const getDashboard = () => {
//     switch (user.role) {
//       case 'patient':
//         return renderPatientDashboard();
//       case 'doctor':
//         return renderDoctorDashboard();
//       case 'staff':
//         return renderStaffDashboard();
//       case 'admin':
//         return renderAdminDashboard();
//       default:
//         return <div>Unknown role</div>;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {getDashboard()}
//     </div>
//   );
// }

// export default Dashboard;

// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AdminDashboard from './admin/Dashboard';
import LabTechnicianDashboard from './lab-technician/Dashboard';
import NurseDashboard from './nurse/Dashboard';

function Dashboard() {
  const { user } = useAuth();

  // Add loading state and null checks
  if (!user) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Get role from user data - handle both structures
  const userRole = user.role || (user.user && user.user.role);

  const renderPatientDashboard = () => (
    <div className="dashboard">
      <h2>Patient Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>My Appointments</h3>
          <p>View and manage your appointments</p>
          <Link to="/appointments" className="btn-secondary">View Appointments</Link>
        </div>
        <div className="card">
          <h3>Medical Records</h3>
          <p>Access your medical history</p>
          <Link to="/records" className="btn-secondary">View Records</Link>
        </div>
        <div className="card">
          <h3>Find Doctors</h3>
          <p>Book appointments with specialists</p>
          <Link to="/doctors" className="btn-secondary">Find Doctors</Link>
        </div>
        <div className="card">
          <h3>My Profile</h3>
          <p>Update your personal and medical information</p>
          <Link to="/profile" className="btn-secondary">Update Profile</Link>
        </div>
        <div className="card">
          <h3>Billing & Payments</h3>
          <p>View and pay your medical bills</p>
          <Link to="/billing" className="btn-secondary">View Bills</Link>
        </div>
      </div>
    </div>
  );

  const renderDoctorDashboard = () => (
    <div className="dashboard">
      <h2>Doctor Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Appointment Schedule</h3>
          <p>Manage your appointments</p>
          <Link to="/schedule" className="btn-secondary">View Schedule</Link>
        </div>
        <div className="card">
          <h3>Patient Records</h3>
          <p>Access patient medical records</p>
          <Link to="/patients" className="btn-secondary">View Patients</Link>
        </div>
        <div className="card">
          <h3>Prescriptions</h3>
          <p>Write and manage prescriptions</p>
          <Link to="/prescriptions" className="btn-secondary">Manage Prescriptions</Link>
        </div>
        <div className="card">
          <h3>My Profile</h3>
          <p>Update your professional information</p>
          <Link to="/profile" className="btn-secondary">Update Profile</Link>
        </div>
      </div>
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="dashboard">
      <h2>Staff Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Appointment Management</h3>
          <p>Manage all appointments</p>
          <Link to="/appointments" className="btn-secondary">Manage Appointments</Link>
        </div>
        <div className="card">
          <h3>Patient Management</h3>
          <p>Handle patient registrations</p>
          <Link to="/patients" className="btn-secondary">Manage Patients</Link>
        </div>
        <div className="card">
          <h3>Billing</h3>
          <p>Handle billing and payments</p>
          <Link to="/billing" className="btn-secondary">Manage Billing</Link>
        </div>
        <div className="card">
          <h3>My Profile</h3>
          <p>Update your staff information</p>
          <Link to="/profile" className="btn-secondary">Update Profile</Link>
        </div>
      </div>
    </div>
  );

  // const renderAdminDashboard = () => (
  //   <div className="dashboard">
  //     <h2>Admin Dashboard</h2>
  //     <div className="dashboard-cards">
  //       <div className="card">
  //         <h3>User Management</h3>
  //         <p>Manage all users and permissions</p>
  //         <Link to="/admin/users" className="btn-secondary">Manage Users</Link>
  //       </div>
  //       <div className="card">
  //         <h3>System Settings</h3>
  //         <p>Configure system settings</p>
  //         <Link to="/settings" className="btn-secondary">System Settings</Link>
  //       </div>
  //       <div className="card">
  //         <h3>Reports</h3>
  //         <p>View system reports and analytics</p>
  //         <Link to="/admin/reports" className="btn-secondary">View Reports</Link>
  //       </div>
  //       <div className="card">
  //         <h3>My Profile</h3>
  //         <p>Update your admin profile</p>
  //         <Link to="/profile" className="btn-secondary">Update Profile</Link>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const renderNurseDashboard = () => (
  //   <div className="dashboard">
  //     <h2>Nurse Dashboard</h2>
  //     <div className="dashboard-cards">
  //       <div className="card">
  //         <h3>Vital Signs</h3>
  //         <p>Record and monitor patient vital signs</p>
  //         <Link to="/nurse/vital-signs" className="btn-secondary">Manage Vitals</Link>
  //       </div>
  //       <div className="card">
  //         <h3>Patient Arrival</h3>
  //         <p>Track patient arrivals and status</p>
  //         <Link to="/nurse/patient-arrival" className="btn-secondary">Track Arrivals</Link>
  //       </div>
  //       <div className="card">
  //         <h3>Medical Records</h3>
  //         <p>Add and view patient medical records</p>
  //         <Link to="/nurse/medical-records" className="btn-secondary">Manage Records</Link>
  //       </div>
  //       <div className="card">
  //         <h3>Attendance</h3>
  //         <p>Track your attendance and leave</p>
  //         <Link to="/nurse/attendance" className="btn-secondary">View Attendance</Link>
  //       </div>
  //     </div>
  //   </div>
  // );

  const getDashboard = () => {
    switch (userRole) {
      case 'patient':
        return renderPatientDashboard();
      case 'doctor':
        return renderDoctorDashboard();
      case 'staff':
        return renderStaffDashboard();
      case 'admin':
        return <AdminDashboard />;
      case 'lab_technician':
        return <LabTechnicianDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      default:
        return (
          <div className="error-message">
            <h3>Unknown Role: {userRole}</h3>
            <p>Please contact support or try updating your profile.</p>
            <Link to="/profile" className="btn-primary">Update Profile</Link>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {getDashboard()}
    </div>
  );
}

export default Dashboard;
