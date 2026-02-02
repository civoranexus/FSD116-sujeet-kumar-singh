import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Register = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', otp: ''
  });
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/send-otp', { 
            email: formData.email 
        });
        alert(response.data.message);
        setStep(2);
    } catch (err) {
       
        const errorMsg = err.response?.data?.message || "Internal Error.";
        console.error("Full Error:", err);
        alert(errorMsg);
    }
};

  const handleVerifyOtp = () => {
    
    setStep(3);
    };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful! ✅");
      navigate('/login');
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  return (
    <div className="register-full-page">
      <div className="register-card">
        <h2 style={{ color: '#2e7d32' }}>New Account</h2>
        
        <form onSubmit={handleFinalRegister} className="login-form">
         
          {step === 1 && (
            <>
              <input className="login-input" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input className="login-input" placeholder="Email ID" type="email" onChange={e => setFormData({...formData, email: e.target.value})} required />
              <input className="login-input" placeholder="Mobile Number" type="tel" onChange={e => setFormData({...formData, mobile: e.target.value})} required />
              <button type="button" onClick={handleSendOtp} className="login-button">Verify Mobile/Email</button>
            </>
          )}

          {step === 2 && (
            <>
              <p>OTP send...</p>
              <input className="login-input" placeholder="Enter 6-digit OTP" onChange={e => setFormData({...formData, otp: e.target.value})} required />
              <button type="button" onClick={handleVerifyOtp} className="login-button" style={{background: '#ffa000'}}>Verify OTP</button>
            </>
          )}

          {step === 3 && (
            <>
              <p style={{color: 'green'}}> Mobile Verified!</p>
              <input className="login-input" type="password" placeholder="Create Strong Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
              <button type="submit" className="login-button">Complete Registration</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;