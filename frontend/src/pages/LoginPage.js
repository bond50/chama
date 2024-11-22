import React, { useEffect } from 'react';
import Login from '../components/LoginComponent';
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already authenticated
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData?.userId;

        if (userId) {
            // Redirect to dashboard or intended page if the user is authenticated
            let intended = location.state;
            if (intended) {
                navigate(intended.from);
            }
        }
    }, [location.state, navigate]);

    const handleLoginSuccess = (data) => {
        let intended = location.state;
        if (intended) {
            navigate(intended.from);
        } else {
            if (data.assignedNumber) {
                navigate("/dashboard");
            } else {
                navigate("/pick");
            }
        }
    };

    return (
        <div className="container">
            <Login onLoginSuccess={handleLoginSuccess} />
        </div>
    );
};

export default LoginPage;
