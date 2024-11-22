import apiClient from './apiClient';

// Fetch all users
export const getAllUsers = async () => {
    const response = await apiClient.get('/users');
    return response.data;
};

// Fetch available numbers
export const fetchAvailableNumbers = async () => {
    const response = await apiClient.get('/numbers/available');
    return response.data;
};

// Fetch chosen numbers
export const fetchChosenNumbers = async () => {
    const response = await apiClient.get('/numbers/chosen');
    return response.data;
};

// Create a new user
export const createUser = async (data) => {
    const response = await apiClient.post('/users/create', data);
    return response.data;
};

// Assign a random number to a user
export const assignNumber = async (id) => {
    const response = await apiClient.put(`/users/${id}`);
    return response.data;
};

// Login user
export const loginUser = async (data) => {
    console.log(process.env.REACT_APP_API_URL)

    const response = await apiClient.post('/users/login', data);
    return response.data;
};

// Submit picked number
export const submitPickedNumber = async (data) => {
    const response = await apiClient.post('/numbers/pick', data);
    return response.data;
};



// Fetch a user by ID
export const getUserById = async (userId) => {
    const response = await apiClient.get(`/users/${userId}`); // Replace with your actual API endpoint
    return response.data;
};
