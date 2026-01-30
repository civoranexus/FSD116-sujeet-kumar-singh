import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('userRole', role);

    // Role-based logic
    if (role === 'admin' && email === 'admin@test.com' && password === 'admin123') {
      alert("Admin Login Successful!");
      navigate('/dashboard');
    } 
    else if (role === 'staff' && email === 'staff@test.com' && password === 'staff123') {
      alert("Staff Login Successful!");
      navigate('/inventory'); // Staff ko direct inventory dikhao
    } 
    else if (role === 'customer' && email === 'user@test.com' && password === 'user123') {
      alert("Customer Login Successful!");
      localStorage.setItem('userRole', 'customer');
      navigate('/customer'); // Customer ke liye alag page
    } 
    else {
      alert("Invalid Credentials for " + role);
    }
  };

  return (
    <div className="login-wrapper" style={styles.wrapper}>
      <div className="login-card" style={styles.card}>
        <h2 style={{ color: '#2e7d32' }}>Nursery Portal</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          
          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>

          <input 
            type="email" placeholder="Email" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
            style={styles.input} required 
          />
          
          <input 
            type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            style={styles.input} required 
          />

          <button type="submit" style={styles.button}>Login as {role}</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e8f5e9' },
  card: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '350px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Login;