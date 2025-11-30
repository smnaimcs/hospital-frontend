// // src/components/common/Navbar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <nav className="navbar">
//       <div className="nav-brand">
//         <Link to="/dashboard">Hospital System</Link>
//       </div>
      
//       <div className="nav-links">
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/profile">Profile</Link>
        
//         {user.role === 'patient' && (
//           <>
//             <Link to="/appointments">Appointments</Link>
//             <Link to="/doctors">Doctors</Link>
//           </>
//         )}
        
//         {user.role === 'doctor' && (
//           <>
//             <Link to="/schedule">Schedule</Link>
//             <Link to="/patients">Patients</Link>
//           </>
//         )}
        
//         {user.role === 'staff' && (
//           <>
//             <Link to="/appointments">Appointments</Link>
//             <Link to="/patients">Patients</Link>
//             <Link to="/billing">Billing</Link>
//           </>
//         )}
        
//         {user.role === 'admin' && (
//           <>
//             <Link to="/users">Users</Link>
//             <Link to="/reports">Reports</Link>
//             <Link to="/settings">Settings</Link>
//           </>
//         )}
//       </div>
      
//       <div className="nav-user">
//         <span>Welcome, {user.first_name}</span>
//         <span className="user-role">({user.role})</span>
//         <button onClick={handleLogout} className="btn-logout">
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  // Get user details from the profile structure
  const userName = user.first_name || (user.user && user.user.first_name);
  const userRole = user.role || (user.user && user.user.role);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">Hospital System</Link>
      </div>
      
      <div className="nav-links">
        {userRole === 'patient' && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/doctors">Doctors</Link>
          </>
        )}
        
        {userRole === 'doctor' && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/schedule">Schedule</Link>
            <Link to="/patients">Patients</Link>
          </>
        )}
        
        {userRole === 'staff' && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/billing">Billing</Link>
          </>
        )}
        
        {userRole === 'admin' && (
          <>
            {/* <Link to="/admin/dashboard">Dashboard</Link> */}
            <Link to="/profile">Profile</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/appointments">Appointments</Link>
            <Link to="/admin/inventory">Inventory</Link>
            <Link to="/admin/billing">Billing</Link>
            <Link to="/admin/reports">Reports</Link>
            <Link to="/admin/notifications">Notifications</Link>
          </>
        )}
      </div>
      
      <div className="nav-user">
        <span>Welcome, {userName}</span>
        <span className="user-role">({userRole})</span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;