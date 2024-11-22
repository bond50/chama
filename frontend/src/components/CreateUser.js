import React, { useState } from 'react';
import { createUser } from '../api';

const CreateUser = ({ onUserCreated }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous success messages

        // Trim spaces from name and phone number before sending them
        const trimmedName = name.trim();
        const trimmedPhoneNumber = phoneNumber.trim();

        try {
            // Send trimmed name and phone number to the backend
            const response = await createUser({ name: trimmedName, phoneNumber: trimmedPhoneNumber });

            // Show success message
            setSuccess(response.message);

            // Update the parent component (optional)
            onUserCreated && onUserCreated(response.newUser);

            // Clear the fields after user creation
            setName('');
            setPhoneNumber('');
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'An unknown error occurred';
            setError(`Error creating user: ${errorMessage}`);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Create New User</h2>
                {error && <p className="text-danger text-center">{error}</p>} {/* Display error message */}
                {success && <p className="text-success text-center">{success}</p>} {/* Display success message */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            pattern="^[0-9]{10}$" // Phone number validation
                            title="Phone number must be 10 digits"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Create User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
