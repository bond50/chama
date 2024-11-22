import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient'; // Axios instance

export const AdminProtectedRoute = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                // Call an endpoint to check admin access
                const response = await apiClient.get('/auth/verify-admin');
                if (response.data.role === 'admin') {
                    setIsAdmin(true); // User is an admin
                } else {
                    navigate('/dashboard'); // Redirect to homepage or user dashboard
                }
            } catch (error) {
                console.error('Admin verification failed:', error);
                navigate('/'); // Redirect on failure
            } finally {
                setIsLoading(false);
            }
        };

        verifyAdmin();
    }, [navigate]);

    if (isLoading) {
        return <p>Loading...</p>; // Show a loading state while verifying
    }

    return isAdmin ? <Outlet /> : null; // Render child routes if admin
};
