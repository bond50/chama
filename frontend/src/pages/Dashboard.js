import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getUserById, fetchAvailableNumbers, fetchChosenNumbers } from '../api'; // Assuming you have an API function to fetch available and chosen numbers

const Dashboard = () => {
    const [user, setUser] = useState(null); // State to store the logged-in user
    const [picked, setPicked] = useState([]); // People with assigned numbers
    const [notPicked, setNotPicked] = useState([]); // People without assigned numbers
    const [availableNumbers, setAvailableNumbers] = useState([]); // Available numbers
    const [chosenNumbers, setChosenNumbers] = useState([]); // Chosen numbers
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any errors
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData?.userId;

    // Function to mask phone numbers
    const maskPhoneNumber = (phone) => {
        if (!phone) return phone;
        // Mask all but first 3 and last 2 digits
        return phone.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2');
    };

    // Fetch user data and validate user authentication
    useEffect(() => {
        if (!userId) {
            // Redirect to login if no userId found
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch the logged-in user details
                const userDetails = await getUserById(userId);
                setUser(userDetails); // Update user state

                // Redirect to /pick if the user has not chosen a number
                if (!userDetails.chosen) {
                    navigate('/pick');
                    return;
                }

                // Fetch all users to populate picked and not-picked
                const allUsers = await getAllUsers();

                // Separate picked and not-picked users
                const pickedUsers = allUsers.filter(person => person.chosen);
                const notPickedUsers = allUsers.filter(person => !person.chosen);

                setPicked(pickedUsers); // Update picked users
                setNotPicked(notPickedUsers); // Update not-picked users

                // Fetch available and chosen numbers
                const availableResponse = await fetchAvailableNumbers();
                const chosenResponse = await fetchChosenNumbers();

                setAvailableNumbers(availableResponse.map((num) => num.number)); // Set available numbers
                setChosenNumbers(chosenResponse.map((num) => num.number)); // Set chosen numbers

                setLoading(false); // Set loading to false
            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load data. Please try again.');
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchData(); // Fetch data on component mount

        // Set up polling to refresh data every 5 seconds
        const interval = setInterval(fetchData, 5000);

        // Clear interval when component unmounts
        return () => clearInterval(interval);
    }, [navigate, userId]);

    // Display loading message
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // Display error message if any
    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    // Sort the picked (assigned numbers) table by assignedNumber (smallest to largest)
    const sortedPicked = picked.sort((a, b) => a.assignedNumber - b.assignedNumber);

    // Sort the not-picked (alphabetical by name)
    const sortedNotPicked = notPicked.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="container mt-3">
            <h2 className="text-center mb-3 fs-4">Dashboard</h2>

            {/* Bootstrap grid layout */}
            <div className="row mb-3">
                {/* Card for people with assigned numbers (sorted by smallest to largest) */}
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
                                        {sortedPicked.map((person) => (
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

                {/* Card for people without assigned numbers (sorted alphabetically by name) */}
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
                                        {sortedNotPicked.map((person) => (
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

            {/* Display Available Numbers */}
            <div className="row mb-3">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white p-2">
                            <h5 className="card-title mb-0 fs-6">Available Numbers</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="d-flex flex-wrap justify-content-center">
                                {availableNumbers.map((number) => (
                                    <div
                                        key={number}
                                        className="m-1 p-2 rounded shadow-sm text-center fw-bold fs-6"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            backgroundColor: "#d4edda", // Greenish for available
                                            border: "2px solid #28a745",
                                            color: "#212529",
                                            transition: "transform 0.3s",
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

            {/* Display Chosen Numbers */}
            <div className="row mb-3">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-danger text-white p-2">
                            <h5 className="card-title mb-0 fs-6">Chosen Numbers</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="d-flex flex-wrap justify-content-center">
                                {chosenNumbers.map((number) => (
                                    <div
                                        key={number}
                                        className="m-1 p-2 rounded shadow-sm text-center fw-bold fs-6"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            backgroundColor: "#f8d7da", // Reddish for chosen
                                            border: "2px solid #dc3545",
                                            color: "#212529",
                                            transition: "transform 0.3s",
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
