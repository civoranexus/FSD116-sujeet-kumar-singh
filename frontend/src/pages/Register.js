import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '', role: 'Staff' });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', userData);
            alert("Naya User register ho gaya!");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h2>Create New Account (Admin/Staff)</h2>
            <form onSubmit={handleRegister}>
                <input placeholder="Full Name" onChange={e => setUserData({...userData, name: e.target.value})} required style={inputStyle} />
                <input placeholder="Email" type="email" onChange={e => setUserData({...userData, email: e.target.value})} required style={inputStyle} />
                <input placeholder="Password" type="password" onChange={e => setUserData({...userData, password: e.target.value})} required style={inputStyle} />
                <select onChange={e => setUserData({...userData, role: e.target.value})} style={inputStyle}>
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                </select>
                <button type="submit" style={{ padding: '10px 20px', background: '#2e7d32', color: 'white' }}>Register User</button>
            </form>
        </div>
    );
};

const inputStyle = { display: 'block', margin: '10px 0', padding: '10px', width: '300px' };

export default Register;