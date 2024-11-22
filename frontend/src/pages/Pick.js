import React, { useState, useEffect } from 'react';
import { fetchAvailableNumbers, fetchChosenNumbers, submitPickedNumber, getUserById } from '../api'; // Assume API functions
import { useNavigate } from 'react-router-dom';

const Pick = () => {
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [chosenNumbers, setChosenNumbers] = useState([]);
    const [totalNumbers, setTotalNumbers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userChosenStatus, setUserChosenStatus] = useState(null); // Store the user's 'chosen' status
    const [userName, setUserName] = useState(""); // Store the logged-in user's name
    const navigate = useNavigate();

    // Fetch and validate user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData?.userId;

    // Redirect to login if userId is not valid
    useEffect(() => {
        if (!userId) {
            alert("User not authenticated. Redirecting to login...");
            navigate("/login");
        }
    }, [userId, navigate]);

    // Fetch user data including 'chosen' field from the database
    const fetchUserData = async () => {
        try {
            const user = await getUserById(userId); // Fetch user data by userId
            setUserChosenStatus(user.chosen); // Set the user's chosen status
            setUserName(user.name); // Set the user's name

            // Redirect to dashboard if the user has already picked a number
            if (user.chosen) {
                navigate("/dashboard"); // Change this to the actual path of your dashboard
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to fetch user data. Please try again.");
        }
    };

    const fetchData = async () => {
        try {
            const availableResponse = await fetchAvailableNumbers();
            const chosenResponse = await fetchChosenNumbers();

            // Shuffle the available numbers after fetching
            const shuffledAvailableNumbers = shuffleArray(availableResponse.map((num) => num.number));

            // Combine available and chosen numbers for unified view
            const totalNumbersSet = new Set([
                ...shuffledAvailableNumbers,
                ...chosenResponse.map((num) => num.number),
            ]);
            setTotalNumbers([...totalNumbersSet].sort((a, b) => a - b));

            setAvailableNumbers(shuffledAvailableNumbers); // Set shuffled available numbers
            setChosenNumbers(chosenResponse.map((num) => num.number));
        } catch (error) {
            console.error("Error fetching numbers:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchUserData(); // Fetch user data including 'chosen' field on component mount
    }, []);

    // Function to shuffle an array using Fisher-Yates algorithm
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    };

    const handlePickNumber = async () => {
        if (availableNumbers.length === 0) {
            alert("No available numbers to pick.");
            return;
        }

        if (userChosenStatus) {
            alert("You have already chosen a number.");
            return;
        }

        setLoading(true);

        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const randomNumber = availableNumbers[randomIndex];

        try {
            const response = await submitPickedNumber({
                pickedNumber: randomNumber,
                userId: userId, // Pass validated userId
            });
            alert(response.message || "Number submitted successfully.");

            // Update user's chosen status
            fetchUserData(); // Refresh user chosen status
            fetchData(); // Refresh numbers data
        } catch (error) {
            console.error("Error submitting number:", error);
            alert(
                error?.response?.data?.message || "Failed to submit. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container my-5'>
            <div className="d-flex flex-column align-items-center justify-content-center vh-100 mt-5" >
                <div className="card shadow-lg p-4 w-100" style={{maxWidth: "800px"}}>
                    <h3 className="text-center mb-4">
                        Welcome, {userName || "User"}! Select your chama number
                    </h3>

                    {/* Instructions with improved styling */}
                    <div className="alert alert-info mb-4" role="alert">
                        <p><strong>How to Pick a Number:</strong></p>
                        <ul className="list-unstyled mb-0" style={{fontSize: "1.1rem"}}>
                            <li><i className="bi bi-check-circle" style={{color: "#28a745"}}></i> <strong>Step 1:</strong> Click the <strong>"Pick a Number"</strong> button below.</li>
                            <li><i className="bi bi-check-circle" style={{color: "#28a745"}}></i> <strong>Step 2:</strong> If a number is available, it will be picked randomly from the list.</li>
                            <li><i className="bi bi-check-circle" style={{color: "#28a745"}}></i> <strong>Step 3:</strong> Once you pick a number, it will be marked as chosen, and you won’t be able to choose again.</li>
                            <li><i className="bi bi-check-circle" style={{color: "#28a745"}}></i> <strong>Important:</strong> Chosen numbers are displayed in red, and available numbers are in green.</li>
                        </ul>
                    </div>

                    {/* Fairness message */}
                    <div className="alert alert-info mb-4" role="alert">
                        <p><strong>This is a free and fair pick process:</strong> No one is favored, and all numbers are randomly assigned. Everyone has an equal chance to pick a number.</p>
                    </div>

                    {/* Legend for chosen and available */}
                    <div className="d-flex justify-content-around mb-3">
                        <div className="d-flex align-items-center">
                            <div
                                className="me-2"
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: "#d4edda", // Greenish for available
                                    border: "2px solid #28a745",
                                    borderRadius: "3px",
                                }}
                            />
                            <span>Available</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <div
                                className="me-2"
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: "#f8d7da", // Reddish for chosen
                                    border: "2px solid #dc3545",
                                    borderRadius: "3px",
                                }}
                            />
                            <span>Chosen</span>
                        </div>
                    </div>

                    {/* Button to pick a number */}
                    <button
                        className="btn btn-primary btn-lg w-100 mb-4"
                        onClick={handlePickNumber}
                        disabled={availableNumbers.length === 0 || loading || userChosenStatus}
                    >
                        {loading ? "Submitting..." : "Pick a Number"}
                    </button>

                    {/* Display all numbers as boxes */}
                    <div className="d-flex flex-wrap justify-content-center">
                        {totalNumbers.map((number) => (
                            <div
                                key={number}
                                className={`m-2 p-3 rounded shadow-sm text-center fw-bold`}
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: chosenNumbers.includes(number)
                                        ? "#f8d7da" // Reddish for chosen
                                        : "#d4edda", // Greenish for available
                                    border: chosenNumbers.includes(number)
                                        ? "2px solid #dc3545"
                                        : "2px solid #28a745",
                                    color: "#212529",
                                    cursor: chosenNumbers.includes(number) || userChosenStatus
                                        ? "not-allowed" // Disable cursor if chosen or user has already picked
                                        : "pointer",
                                }}
                            >
                                {number}
                            </div>
                        ))}
                    </div>

                    {/* Show message if no numbers are present */}
                    {totalNumbers.length === 0 && (
                        <div className="alert alert-warning text-center mt-3" role="alert">
                            No numbers available or chosen.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pick;
