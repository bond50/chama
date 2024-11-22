import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient'; // Axios instance

export const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Call the backend to verify the token
        await apiClient.get('/auth/verify');
        setIsLoading(false); // User is authenticated
      } catch (error) {
        console.error('Authentication failed:', error);

        // Clear cookies and localStorage if authentication fails
        clearAuthData();

        // Redirect to login page
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  const clearAuthData = () => {
    // Remove the token from cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

    // Remove user data from localStorage
    localStorage.removeItem('userData');
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show a loading state while verifying
  }

  return <Outlet />; // Render child routes if authenticated
};
