import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';
import './Signup.css';
import SignupL from '../../public/images/Signup.json';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom'; // Import the Link component
import Navbar from '../Navbar'

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      alert(response.data.message);
      navigate('/verify-email');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <>
    {/* Navbar Component */}
    <Navbar />
    <div className="signup-container">
      <div className="lottieAnimation">
        <Lottie animationData={SignupL} />
      </div>
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          {/* City and State in One Line */}
          <div className="row">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
            />
          </div>
          <div className="row">
            <input
              type="text"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        {/* Link to Login page */}
        <div className="login-link">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-text">Login</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
