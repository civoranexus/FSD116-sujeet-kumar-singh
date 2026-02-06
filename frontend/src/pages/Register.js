import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [emailExists, setEmailExists] = useState(false); // New state
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', address: '', pincode: '', password: ''
  });
  const navigate = useNavigate();

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(res.data.message);
      navigate('/login'); 
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.includes("registered")) {
          setEmailExists(true); // Agar email registered hai to forgot link dikhao
      }
      alert(msg || "Registration Failed! ❌");
    }
  };

  return (
    <div className="register-full-page">
      <div className="register-card">
        <h2 style={{ color: '#2e7d32' }}>🌱 {step === 1 ? 'Customer Details' : 'Security Setup'}</h2>
        
        {step === 1 && (
          <form onSubmit={handleNextStep} className="login-form">
            <p style={{fontSize: '14px', color: '#666'}}>Please enter your delivery details</p>
            <input className="login-input" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input className="login-input" placeholder="Email ID" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input className="login-input" placeholder="Mobile Number" type="tel" maxLength="10" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
            <input className="login-input" placeholder="Full Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            <input className="login-input" placeholder="Pincode" type="number" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required />
            
            <button type="submit" className="login-button">Next Step</button>
            
            {emailExists && (
               <p style={{marginTop: '10px', color: 'red', fontSize: '13px'}}>
                  Email already exists! <Link to="/forgot-password" style={{color: '#2e7d32', fontWeight: 'bold'}}>Forgot Password?</Link>
               </p>
            )}
            
            <p style={{marginTop: '15px'}}>Already have an account? <Link to="/login" style={{color: '#2e7d32'}}>Login</Link></p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="login-form">
            <p style={{fontSize: '14px', color: '#666'}}>Set a strong password for your ID: <b>{formData.email}</b></p>
            <input 
              className="login-input" type="password" placeholder="Create Strong Password" 
              onChange={e => setFormData({...formData, password: e.target.value})} required autoFocus
            />
            <button type="submit" className="login-button">Create My Account</button>
            <button type="button" onClick={() => setStep(1)} style={{background: 'none', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer'}}>Go Back</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;