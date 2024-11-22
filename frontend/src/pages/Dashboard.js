import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {getAllUsers, getUserById, fetchAvailableNumbers, fetchChosenNumbers} from '../api'; // Assuming API functions are correctly set up

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [picked, setPicked] = useState([]);
    const [notPicked, setNotPicked] = useState([]);
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [chosenNumbers, setChosenNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = JSON.parse(localStorage.getItem("token") || "{}");

    const maskPhoneNumber = useCallback((phone) => {
        if (!phone) return phone;
        return phone.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2');
    }, []);


    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        if (user && !user.chosen) { // Add null check for user
            navigate('/pick');
        }
    }, [navigate, token, user]);

    const fetchUserData = useCallback(async () => {
        try {
            const userDetails = await getUserById(userData.userId);
            setUser(userDetails);
            const allUsers = await getAllUsers();
            setPicked(allUsers.filter(person => person.chosen));
            setNotPicked(allUsers.filter(person => !person.chosen));

            const availableResponse = await fetchAvailableNumbers();
            const chosenResponse = await fetchChosenNumbers();
            setAvailableNumbers(availableResponse.map(num => num.number));
            setChosenNumbers(chosenResponse.map(num => num.number));

            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError('Failed to load data. Please try again.');
            setLoading(false);
        }
    }, [userData.userId]);

    useEffect(() => {
        fetchUserData();

        const interval = setInterval(fetchUserData, 5000);
        return () => clearInterval(interval);
    }, [fetchUserData]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-danger">{error}</div>;

    const sortedPicked = [...picked].sort((a, b) => a.assignedNumber - b.assignedNumber);
    const sortedNotPicked = [...notPicked].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="container mt-3">
            <h2 className="text-center mb-3 fs-4">Dashboard</h2>

            <div className="row mb-3">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white p-2">
                            <h5 className="card-title mb-0 fs-6">People with Assigned Numbers</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm mb-0">
                                    <thead>
                                    <tr>
                                        <th className="p-1 fs-6">#</th>
                                        <th className="p-1 fs-6">Name</th>
                                        <th className="p-1 fs-6">Phone</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedPicked.map(person => (
                                        <tr key={person._id}>
                                            <td className="p-1">{person.assignedNumber}</td>
                                            <td className="p-1">{person.name}</td>
                                            <td className="p-1">{maskPhoneNumber(person.phoneNumber)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-warning text-dark p-2">
                            <h5 className="card-title mb-0 fs-6">People Without Assigned Numbers</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm mb-0">
                                    <thead>
                                    <tr>
                                        <th className="p-1 fs-6">#</th>
                                        <th className="p-1 fs-6">Name</th>
                                        <th className="p-1 fs-6">Phone</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedNotPicked.map(person => (
                                        <tr key={person._id}>
                                            <td className="p-1">-</td>
                                            <td className="p-1">{person.name}</td>
                                            <td className="p-1">{maskPhoneNumber(person.phoneNumber)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white p-2">
                            <h5 className="card-title mb-0 fs-6">Available Numbers</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="d-flex flex-wrap justify-content-center">
                                {availableNumbers.map(number => (
                                    <div
                                        key={number}
                                        className="m-1 p-2 rounded shadow-sm text-center fw-bold fs-6"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            backgroundColor: "#d4edda",
                                            border: "2px solid #28a745",
                                            color: "#212529",
                                        }}
                                    >
                                        {number}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-danger text-white p-2">
                            <h5 className="card-title mb-0 fs-6">Chosen Numbers</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="d-flex flex-wrap justify-content-center">
                                {chosenNumbers.map(number => (
                                    <div
                                        key={number}
                                        className="m-1 p-2 rounded shadow-sm text-center fw-bold fs-6"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            backgroundColor: "#f8d7da",
                                            border: "2px solid #dc3545",
                                            color: "#212529",
                                        }}
                                    >
                                        {number}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
