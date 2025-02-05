import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword(token, newPassword);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;