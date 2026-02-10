import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear(); 
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { 
        email: email.trim(), 
        password: password 
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name); 
      localStorage.setItem('userId', res.data.id);

      if (res.data.role === 'admin' || res.data.role === 'staff') {
        window.location.href = '/dashboard'; 
      } else {
        window.location.href = '/customer'; 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <span style={{fontSize: '50px'}}>🌱</span>
          <h2>Civora Portal</h2>
          <p>Welcome back! Please sign in to your account.</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              className="login-input" 
              type="email" 
              name="email"     
              id="email"       
              autoComplete="username"
              placeholder="e.g. sujeet@example.com" 
              value={email}    
              onChange={(e)=>setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
                <input 
                  className="login-input" 
                  type={showPassword ? "text" : "password"} 
                  name="password"    
                  id="password" 
                  autoComplete="current-password" 
                  placeholder="Your secure password" 
                  value={password}    
                  onChange={(e)=>setPassword(e.target.value)} 
                  required 
                />
                <span 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#2e7d32' }}
                >
                    {showPassword ? "HIDE" : "SHOW"}
                </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '-10px' }}>
            <Link 
              to="/forgot-password" 
              style={{ color: '#2e7d32', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}
            >
              Recover Account?
            </Link>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="register-link-container">
          <span>New to Civora? </span>
          <Link to="/register" className="register-link">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;