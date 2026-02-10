import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css'; 
import logo from '../assets/short_logo.png';

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="sidebar-nav">
      <div className="sidebar-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={logo} 
            alt="Civora Logo"  
            style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
          />
          Nursery App
        </h3>
        <p className="role-badge">{role?.toUpperCase()}</p>
      </div>
      
      <div className="sidebar-links">
        {(role === 'admin' || role === 'staff') && (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/inventory">🌿 Inventory</Link>
            <Link to="/orders">📦 Order Management</Link>
          </>
        )}

        {role === 'admin' && (
          <>
            <Link to="/staff">👥 Staff List</Link>
            <Link to="/procurement">🚜 Procurement</Link>
          </>
        )}

       
        {role === 'staff' && (
          <Link to="/sales">💰 Daily Sales</Link>
        )}

        {role === 'customer' && (
          <>
            <Link to="/customer">🛒 Shop Seeds</Link>
            <Link to="/orders">📦 My Orders</Link>
            <Link to="/profile">👤 My Profile</Link>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default Sidebar;