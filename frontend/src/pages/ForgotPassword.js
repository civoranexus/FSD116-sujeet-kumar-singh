import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/check-user', { email });
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.message || "Registered email not found in our system.");
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/auth/reset-password', { email, newPassword });
            alert("Password successfully updated! ✅");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Error updating password. Please try again.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>🔐 Account Recovery</h2>
                <form onSubmit={step === 1 ? handleCheckEmail : handleReset} className="login-form">
                    {step === 1 ? (
                        <>
                            <p style={{fontSize: '14px', color: '#666', marginBottom: '15px'}}>Enter your registered email to reset password.</p>
                            <input className="login-input" placeholder="Registered Email Address" type="email" onChange={(e) => setEmail(e.target.value)} required />
                            <button type="submit" className="login-button">Verify Identity</button>
                        </>
                    ) : (
                        <>
                            <div style={{background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '15px'}}>
                                <span style={{fontSize: '13px', color: '#555'}}>Recovering for:</span>
                                <p style={{fontWeight: 'bold', margin: 0}}>{email}</p>
                            </div>
                            <input className="login-input" placeholder="Create New Password" type="password" onChange={(e) => setNewPassword(e.target.value)} required />
                            <button type="submit" className="login-button" style={{background: '#ffa000'}}>Update Password</button>
                        </>
                    )}
                </form>
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                    <button onClick={() => navigate('/login')} style={{background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', textDecoration: 'underline'}}>
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;