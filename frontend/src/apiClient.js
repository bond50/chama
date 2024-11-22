import axios from 'axios';

// Get the base URL from the environment variable
const apiUrl = process.env.REACT_APP_API_URL;

// Create Axios instance
const apiClient = axios.create({
    baseURL: apiUrl, // Use the value from the environment variable
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000, // Optional timeout for requests
    withCredentials: true, // Ensure cookies are sent with requests
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Retrieve the token from cookies (since it's stored in the cookie now)
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1]; // Extract the token from cookies

        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                // Token expired or unauthorized, redirect to login
                window.location.href = "/login"; // Redirect to the login page
            } else if (status === 403) {
                alert("You don't have permission to perform this action.");
            } else if (status === 500) {
                alert("Something went wrong on the server. Please try again later.");
            } else {
                alert(data?.message || "An unexpected error occurred");
            }
        } else if (error.request) {
            alert("Unable to connect to the server. Please check your network.");
        } else {
            alert(error.message || "An error occurred while setting up the request.");
        }

        return Promise.reject(error);
    }
);

export default apiClient;
