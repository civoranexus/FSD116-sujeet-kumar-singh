import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Procurement from './pages/Procurement';
import Staff from './pages/Staff';
import Customer from './pages/Customer';
import Home from './pages/Home';
import Register from './pages/Register'; 

function Layout() {
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/';
  const isFullPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div style={{ display: 'flex' }}>
      {!isFullPage && <Sidebar />}
      
      
      <div style={{ 
        marginLeft: isFullPage ? '0' : '250px', width: '100%' 
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/Customer" element={<Customer />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;