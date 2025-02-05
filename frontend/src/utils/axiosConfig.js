import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api/auth', // Your backend URL
  withCredentials: true, // For cookies
});

export default axiosInstance;