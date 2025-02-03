import React, { useState } from 'react';
import { forgotPassword } from '../../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;