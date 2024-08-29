import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the context and its default values
const AuthContext = createContext({
  token: null,
  role: null, // Add role to context
  setToken: () => {},
  setRole: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // Add role state

   // Update local storage whenever token or role changes
   useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};