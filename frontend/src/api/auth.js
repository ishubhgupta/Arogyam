import axiosInstance from '../utils/axiosConfig';

export const signup = async (data) => {
  return await axiosInstance.post('/signup', data);
};

export const login = async (data) => {
  return await axiosInstance.post('/login', data);
};

export const logout = async () => {
  return await axiosInstance.post('/logout');
};

export const verifyEmail = async (otp) => {
  return await axiosInstance.post('/verify-email', { otp });
};

export const forgotPassword = async (email) => {
  return await axiosInstance.post('/forget-password', { email });
};

export const resetPassword = async (token, newPassword) => {
  return await axiosInstance.post(`/reset-password/${token}`, { newPassword });
};

export const resendVerificationToken = async (email) => {
  return await axiosInstance.post('/resend-verification-token', { email });
};

export const checkAuth = async () => {
  return await axiosInstance.get('/check-auth');
};

export const googleAuth = async () => {
  return await axiosInstance.get('/google');
};