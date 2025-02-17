import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api/auth', // auth endpoints
  withCredentials: true, // For cookies
});

const axiosPatient = axios.create({
  baseURL: 'http://localhost:5001/api/patients', // patient endpoints
  withCredentials: true,
});

axiosPatient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosPatient };