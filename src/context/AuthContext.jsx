// // src/context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import authService from '../services/authService';

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       authService.setToken(token);
//       // Verify token and get user info
//       const userData = authService.getCurrentUser();
//       if (userData) {
//         setUser(userData);
//       }
//     }
//     setLoading(false);
//   }, [token]);

//   const login = async (email, password) => {
//     try {
//       const response = await authService.login(email, password);
//       if (response.success) {
//         setUser(response.user);
//         setToken(response.token);
//         localStorage.setItem('token', response.token);
//         return { success: true };
//       }
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await authService.register(userData);
//       if (response.success) {
//         setUser(response.user);
//         setToken(response.token);
//         localStorage.setItem('token', response.token);
//         return { success: true };
//       }
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Registration failed' 
//       };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     authService.setToken(null);
//   };

//   const updateProfile = async (profileData) => {
//     try {
//       const response = await authService.updateProfile(profileData);
//       if (response.success) {
//         setUser(response.user);
//         return { success: true };
//       }
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Update failed' 
//       };
//     }
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     updateProfile,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      authService.setToken(token);
      // Verify token and get user profile
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If token is invalid, logout
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setToken(response.token);
        localStorage.setItem('token', response.token);
        authService.setToken(response.token);
        
        // Now fetch the complete profile
        const profile = await authService.getProfile();
        setUser(profile);
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setToken(response.token);
        localStorage.setItem('token', response.token);
        authService.setToken(response.token);
        
        // Fetch complete profile after registration
        const profile = await authService.getProfile();
        setUser(profile);
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    authService.setToken(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        // Refresh the user profile after update
        const profile = await authService.getProfile();
        setUser(profile);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    refreshProfile: fetchUserProfile // Export if needed elsewhere
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}