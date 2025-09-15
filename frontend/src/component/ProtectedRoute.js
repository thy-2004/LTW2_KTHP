// frontend/src/component/ProtectedRoute.js
//kiểm tra xác thực vai trò trước khi cho phép truy cập
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
      //ly thông tin user để kiểm tra xác thực vai trò
        const response = await axios.get('http://localhost:8080/api/user/current-user', {
          withCredentials: true
        });
        setIsAuthenticated(true);
        setUserRole(response.data.role);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/user" />;
  }

  return children;
};

export default ProtectedRoute;