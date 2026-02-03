import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css'; 

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
        <h3>🌱 Nursery App</h3>
        <p className="role-badge">{role?.toUpperCase()}</p>
      </div>
      
      <div className="sidebar-links">
        {/* Admin & Staff Common */}
        {(role === 'admin' || role === 'staff') && (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/inventory">🌿 Inventory</Link>
          </>
        )}

        {role === 'customer' && (
        <>
          <Link to="/customer">🛒 Shop Seeds</Link>
          <Link to="/orders">📦 My Orders</Link>
          <Link to="/profile">👤 My Profile</Link>
        </>
        )}

        {/* Admin Specific */}
        {role === 'admin' && (
          <>
            <Link to="/staff">👥 Staff List</Link>
            <Link to="/procurement">🚜 Procurement</Link>
          </>
        )}

        {/* Staff Specific */}
        {role === 'staff' && <Link to="/sales">💰 Daily Sales</Link>}

        {/* Customer Specific */}
        {role === 'customer' && (
          <>
            <Link to="/customer">🛒 Shop Seeds</Link>
            <Link to="/orders">📦 My Orders</Link>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};
export default Sidebar;