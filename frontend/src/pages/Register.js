import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';

const Register = () => {
    const [step, setStep] = useState(1);
    const [emailExists, setEmailExists] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', address: '', pincode: '', password: ''
    });
    const navigate = useNavigate();

    const handleNextStep = (e) => {
        e.preventDefault();
        if (formData.mobile.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }
        setStep(2);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Account Created Successfully! Welcome to Civora. 🌱");
            navigate('/login'); 
        } catch (err) {
            const msg = err.response?.data?.message || "";
            if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exists")) {
                setEmailExists(true); 
            }
            alert(msg || "Registration Failed. Please try again.");
        }
    };

    return (
        <div className="register-full-page">
            <div className="register-card">
                <div className="login-header">
                    <span style={{fontSize: '40px'}}>🌱</span>
                    <h2 style={{ color: '#2e7d32', marginTop: '10px' }}>
                        {step === 1 ? 'Personal Information' : 'Security Settings'}
                    </h2>
                </div>
                
                

                {step === 1 && (
                    <form onSubmit={handleNextStep} className="login-form">
                        <p className="sub-text">Step 1 of 2: Basic Contact Details</p>
                        
                        <div className="input-group">
                            <input className="login-input" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        
                        <div className="input-group">
                            <input className="login-input" placeholder="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                        </div>

                        <div className="input-group">
                            <input className="login-input" placeholder="Mobile Number (10 Digits)" type="tel" maxLength="10" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
                        </div>

                        <div className="input-group">
                            <input className="login-input" placeholder="Residential Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                        </div>

                        <div className="input-group">
                            <input className="login-input" placeholder="Area Pincode" type="number" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required />
                        </div>
                        
                        <button type="submit" className="login-button">Continue to Security</button>
                        
                        {emailExists && (
                           <div className="alert-box-error" style={{marginTop: '15px', fontSize: '13px'}}>
                               This email is already registered. <Link to="/forgot-password" style={{color: '#2e7d32', fontWeight: 'bold'}}>Reset Password?</Link>
                           </div>
                        )}
                        
                        <div style={{marginTop: '20px', textAlign: 'center'}}>
                            <span>Already a member? </span>
                            <Link to="/login" style={{color: '#2e7d32', fontWeight: '600', textDecoration: 'none'}}>Sign In</Link>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleRegister} className="login-form">
                        <p className="sub-text">Step 2 of 2: Account Credentials</p>
                        <div style={{background: '#f1f8e9', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px'}}>
                            <strong>Email ID:</strong> {formData.email}
                        </div>
                        
                        <div className="input-group">
                            <input 
                                className="login-input" 
                                type="password" 
                                placeholder="Create a Strong Password" 
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                                required 
                                autoFocus
                            />
                        </div>

                        <button type="submit" className="login-button">Finalize Registration</button>
                        
                        <button 
                            type="button" 
                            onClick={() => setStep(1)} 
                            style={{background: 'none', border: 'none', color: '#666', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline', width: '100%'}}
                        >
                            Review Information
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;