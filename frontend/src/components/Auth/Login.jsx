import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import './Login.css';
import LoginL from '../../public/images/Login.json';
import Lottie from 'lottie-react';
import Navbar from '../Navbar';
import GoogleIcon from '../../public/images/dashboard/google.png';
import {googleAuth} from '../../api/auth'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      alert(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const fetchDetails = async () => {
    try {
      window.location.href = `http://localhost:5001/api/auth/google`;
      console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <button
  className="google-button"
  onClick={fetchDetails}
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer'
  }}
>
  <img
    src={GoogleIcon}
    alt="Google logo"
    style={{ width: '20px', marginRight: '10px' }}
  />
  Continue with Google
</button>

          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup" className="signup-text">Sign up</Link>
            </p>
          </div>
        </div>

        <div className="lottieAnimation">
          <Lottie animationData={LoginL} />
        </div>
      </div>
    </>
  );
};

export default Login;