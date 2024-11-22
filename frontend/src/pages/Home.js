import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getAllUsers} from "../api"; // API function to fetch all users

const HomePage = () => {
    const [users, setUsers] = useState([]); // State to store all users
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any errors
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = JSON.parse(localStorage.getItem("token") || "{}");
    // Function to mask phone number
    const maskPhoneNumber = (phone) => {
        if (!phone) return phone;
        // Mask all but first 3 and last 2 digits
        return phone.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2');
    };

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers(); // Fetch all users from the server
                setUsers(allUsers); // Update state with user data
                setLoading(false); // Stop loading
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users. Please try again.");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Display loading message
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // Display error message if any
    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    // Function to handle navigation based on user data
    const handleNavigate = (user) => {
        if (!token && userData) {
            // If not logged in, redirect to login page with the intended destination
            navigate("/login", {state: {from: user.chosen ? "/dashboard" : "/pick"}});
        } else {
            // If logged in, check the picked field and navigate accordingly
            if (user.chosen) {
                navigate("/dashboard");
            } else {
                navigate("/pick");
            }
        }
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center mb-3 fs-4">Welcome</h2>
            <div className="row justify-content-center">
                {/* Table Container */}
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white p-2">
                            <h5 className="card-title mb-0 fs-6">Users</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered mb-0 modern-table">
                                    <thead className="table-dark">
                                    <tr>
                                        <th className="p-2 fs-8">Name</th>
                                        <th className="p-2 fs-8">Phone</th>
                                        <th className="p-2 fs-8">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id} className="table-row">

                                            <td className="p-2 fs-8">{user.name}</td>
                                            <td className="p-2 fs-8">{maskPhoneNumber(user.phoneNumber)}</td>
                                            <td className="p-2">
                                                <button
                                                    className={`btn btn-sm ${user.chosen ? "btn-success" : "btn-primary"}`}
                                                    onClick={() => handleNavigate(user)}
                                                >
                                                    {user.chosen ? "Check your position" : "Pick Number"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
