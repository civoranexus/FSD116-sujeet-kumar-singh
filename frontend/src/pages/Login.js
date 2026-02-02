import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === 'admin' && email === 'admin@test.com' && password === 'admin123') {
      navigate('/dashboard');
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 style={{ color: '#2e7d32', textAlign: 'center' }}>Nursery Portal</h2>
        
        <form onSubmit={handleLogin} className="login-form">
          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="login-input">
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>

          <input 
            type="email" placeholder="Email" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
            className="login-input" required 
          />
          
          <input 
            type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            className="login-input" required 
          />

          <button type="submit" className="login-button">Login as {role}</button>
        </form>


        <div className="register-link-container">
          <p style={{ fontSize: '14px', color: '#666' }}>Naya account chahiye?</p>
          <Link to="/register" className="register-link">
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;