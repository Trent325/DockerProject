import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth'; // Adjust the path as necessary

const AuthRoute = ({ element: Component, ...rest }) => {
  const { token } = useAuth();
  const location = useLocation();

  return token ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default AuthRoute;
