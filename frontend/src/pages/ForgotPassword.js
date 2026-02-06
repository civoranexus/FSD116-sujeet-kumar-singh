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
            alert(err.response?.data?.message || "Email not found!");
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/auth/reset-password', { email, newPassword });
            alert("Password Changed! ✅");
            navigate('/login');
        } catch (err) {
            alert("Error updating password");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>🔐 Reset Password</h2>
                <form onSubmit={step === 1 ? handleCheckEmail : handleReset} className="login-form">
                    {step === 1 ? (
                        <>
                            <input className="login-input" placeholder="Enter Registered Email" type="email" onChange={(e) => setEmail(e.target.value)} required />
                            <button type="submit" className="login-button">Verify Email</button>
                        </>
                    ) : (
                        <>
                            <p>Email: {email}</p>
                            <input className="login-input" placeholder="New Password" type="password" onChange={(e) => setNewPassword(e.target.value)} required />
                            <button type="submit" className="login-button" style={{background: '#ffa000'}}>Reset Password</button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;