import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Jab bhi login page par aayein, purana session saaf kar dein
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend ko request bhej rahe hain
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email: email.trim(), 
        password: password 
      });

      console.log("Server Response:", res.data);

      // Data save karna bahut zaroori hai
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name); 

      // Role ke hisab se redirection
      if (res.data.role === 'admin' || res.data.role === 'staff') {
        window.location.href = '/dashboard'; 
      } else {
        window.location.href = '/customer'; 
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      alert(err.response?.data?.message || "Invalid Email or Password!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <span style={{fontSize: '50px'}}>🌱</span>
          <h2>Nursery Portal</h2>
          <p>Sign in to manage your garden</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              className="login-input" 
              type="email" 
              placeholder="admin@test.com" 
              onChange={(e)=>setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              className="login-input" 
              type="password" 
              placeholder="••••••••" 
              onChange={(e)=>setPassword(e.target.value)} 
              required 
            />
          </div>

          <button className="login-button" type="submit">Login Now</button>
        </form>

        <div className="register-link-container">
          <span>New here? </span>
          <Link to="/register" className="register-link">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;