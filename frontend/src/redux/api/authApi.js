import axios from 'axios';


const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API methods
export const signup = (userData) => authApi.post('/auth/signup', userData);
export const login = (credentials) => authApi.post('/auth/login', credentials);
export const getMe = () => authApi.get('/auth/me');
export const logout = () => authApi.post('/auth/logout');

export default {
    signup,
    login,
    getMe,
    logout,
};