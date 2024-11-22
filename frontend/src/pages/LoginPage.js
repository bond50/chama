import React, {useEffect} from 'react';
import Login from '../components/LoginComponent';
import {useLocation, useNavigate} from "react-router-dom";

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Check if the user is already authenticated
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = JSON.parse(localStorage.getItem("token") || "{}");
    useEffect(() => {

        if (userData.userId && token) {
            let intended = location.state;
            if (intended) {
                navigate(intended.from);
            } else {
                navigate('/dashboard')
            }
        }
    }, [location.state, navigate, token, userData.userId]);

    const handleLoginSuccess = (data) => {

        let intended = location.state;
        if (intended) {
            navigate(intended.from);
        } else {
            if (data.assignedNumber) {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        }
    };

    return (
        <div className="container">
            <Login onLoginSuccess={handleLoginSuccess}/>
        </div>
    );
};

export default LoginPage;
