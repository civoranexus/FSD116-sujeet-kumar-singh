import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Sidebar = () => {
  const navigate = useNavigate();
  // LocalStorage se role nikalna
  const userRole = localStorage.getItem('userRole') || 'customer';

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Role clear karein
    navigate('/'); // Login page par bhej dein
  };

  return (
    <div className="sidebar" style={styles.sidebar}>
      {/* <li style={styles.li}><Link to="/" style={styles.link}>🏠 Home</Link></li> */}
      <h2 style={{ textAlign: 'center' }}>Nursery App</h2>
      <p style={{ textAlign: 'center', fontSize: '12px' }}>Role: <b>{userRole.toUpperCase()}</b></p>
      <hr />
      
      <ul style={styles.ul}>
        {/* Sabke liye common links */}
        {(userRole === 'admin' || userRole === 'staff') && (
          <>
            <li style={styles.li}><Link to="/dashboard" style={styles.link}>📊 Dashboard</Link></li>
            <li style={styles.li}><Link to="/inventory" style={styles.link}>📦 Inventory</Link></li>
          </>
        )}

        {/* Sirf Admin ke liye */}
        {userRole === 'admin' && (
          <>
            <li style={styles.li}><Link to="/staff" style={styles.link}>👥 Staff Management</Link></li>
            <li style={styles.li}><Link to="/procurement" style={styles.link}>🚜 Procurement</Link></li>
          </>
        )}

        {/* Staff aur Admin dono ke liye */}
        {(userRole === 'admin' || userRole === 'staff') && (
          <li style={styles.li}><Link to="/sales" style={styles.link}>💰 Sales</Link></li>
        )}

        {/* Customer ke liye special link */}
        {userRole === 'customer' && (
          <li style={styles.li}><Link to="/customer" style={styles.link}>🌱 My Orders</Link></li>
        )}
      </ul>

      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
    </div>
  );
};

const styles = {
  sidebar: { width: '250px', height: '100vh', background: '#2e7d32', color: 'white', position: 'fixed', padding: '20px' },
  ul: { listStyle: 'none', padding: 0 },
  li: { margin: '20px 0' },
  link: { color: 'white', textDecoration: 'none', fontSize: '17px' },
  logoutBtn: { marginTop: '30px', width: '100%', padding: '10px', background: '#c62828', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Sidebar;