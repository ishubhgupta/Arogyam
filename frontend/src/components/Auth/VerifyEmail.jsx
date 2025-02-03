import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../api/auth';
import './VerifyEmail.css'; // Make sure to import the CSS file
import Doctor from '../../public/images/Verify.json';
import Lottie from 'lottie-react';
const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyEmail(otp);
      alert(response.data.message);
      navigate('/login'); // Redirect to login after successful verification
    } catch (error) {
      alert(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-inner-container">
      <div className="lottieAnimation">
        <Lottie animationData={Doctor} />
      </div>
        <div className="verify-email-form-container">
          <h2>Verify Your Email</h2>
          <p>Please enter the OTP sent to your email address.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify Email</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
