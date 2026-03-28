import axios from 'axios';

const USER_SERVICE = 'http://localhost:8080';
const PROPERTY_SERVICE = 'http://localhost:8081';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth APIs
export const register = (data) => axios.post(`${USER_SERVICE}/auth/register`, data);
export const login = (data) => axios.post(`${USER_SERVICE}/auth/login`, data);
export const getMe = () => axios.get(`${USER_SERVICE}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
});

// Property APIs
export const analyzeProperty = (data) => axios.post(`${PROPERTY_SERVICE}/property/analyze`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
});
export const getHistory = (userEmail) => axios.get(`${PROPERTY_SERVICE}/property/history/${userEmail}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
});