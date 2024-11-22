import React, { useState, useEffect, useCallback } from 'react';
import { fetchAvailableNumbers, fetchChosenNumbers, submitPickedNumber, getUserById } from '../api'; // Assume API functions
import { useNavigate } from 'react-router-dom';

const Pick = () => {
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [chosenNumbers, setChosenNumbers] = useState([]);
    const [totalNumbers, setTotalNumbers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userChosenStatus, setUserChosenStatus] = useState(null);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = JSON.parse(localStorage.getItem('token') || '{}');

    useEffect(() => {
        if (!userData && token) {
            navigate('/login');
        }
    }, [navigate, token, userData]);

    const fetchUserData = useCallback(async () => {
        try {
            const user = await getUserById(userData.userId);
            setUserChosenStatus(user.chosen);
            setUserName(user.name);
            if (user.chosen) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to fetch user data. Please try again.');
        }
    }, [navigate, userData.userId]);

    const fetchData = useCallback(async () => {
        try {
            const availableResponse = await fetchAvailableNumbers();
            const chosenResponse = await fetchChosenNumbers();

            const shuffledAvailableNumbers = shuffleArray(availableResponse.map((num) => num.number));
            const totalNumbersSet = new Set([
                ...shuffledAvailableNumbers,
                ...chosenResponse.map((num) => num.number),
            ]);

            setTotalNumbers([...totalNumbersSet].sort((a, b) => a - b));
            setAvailableNumbers(shuffledAvailableNumbers);
            setChosenNumbers(chosenResponse.map((num) => num.number));
        } catch (error) {
            console.error('Error fetching numbers:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchUserData();
    }, [fetchData, fetchUserData]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handlePickNumber = async () => {
        if (availableNumbers.length === 0) {
            alert('No available numbers to pick.');
            return;
        }

        if (userChosenStatus) {
            alert('You have already chosen a number.');
            return;
        }

        setLoading(true);

        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const randomNumber = availableNumbers[randomIndex];

        try {
            const response = await submitPickedNumber({
                pickedNumber: randomNumber,
                userId: userData.userId,
            });
            alert(response.message || 'Number submitted successfully.');

            fetchUserData();
            fetchData();
        } catch (error) {
            console.error('Error submitting number:', error);
            alert(
                error?.response?.data?.message || 'Failed to submit. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container my-5'>
            <div className="d-flex flex-column align-items-center justify-content-center vh-100 mt-5">
                <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '800px' }}>
                    <h3 className="text-center mb-4">
                        Welcome, {userName || 'User'}! Select your chama number
                    </h3>

                    <div className="alert alert-info mb-4" role="alert">
                        <p><strong>How to Pick a Number:</strong></p>
                        <ul className="list-unstyled mb-0" style={{ fontSize: '1.1rem' }}>
                            <li><i className="bi bi-check-circle" style={{ color: '#28a745' }}></i> <strong>Step 1:</strong> Click the <strong>"Pick a Number"</strong> button below.</li>
                            <li><i className="bi bi-check-circle" style={{ color: '#28a745' }}></i> <strong>Step 2:</strong> If a number is available, it will be picked randomly from the list.</li>
                            <li><i className="bi bi-check-circle" style={{ color: '#28a745' }}></i> <strong>Step 3:</strong> Once you pick a number, it will be marked as chosen, and you won’t be able to choose again.</li>
                            <li><i className="bi bi-check-circle" style={{ color: '#28a745' }}></i> <strong>Important:</strong> Chosen numbers are displayed in red, and available numbers are in green.</li>
                        </ul>
                    </div>

                    <button
                        className="btn btn-primary btn-lg w-100 mb-4"
                        onClick={handlePickNumber}
                        disabled={availableNumbers.length === 0 || loading || userChosenStatus}
                    >
                        {loading ? 'Submitting...' : 'Pick a Number'}
                    </button>

                    <div className="d-flex flex-wrap justify-content-center">
                        {totalNumbers.map((number) => (
                            <div
                                key={number}
                                className={`m-2 p-3 rounded shadow-sm text-center fw-bold`}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: chosenNumbers.includes(number) ? '#f8d7da' : '#d4edda',
                                    border: chosenNumbers.includes(number) ? '2px solid #dc3545' : '2px solid #28a745',
                                    color: '#212529',
                                    cursor: chosenNumbers.includes(number) || userChosenStatus ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {number}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pick;
