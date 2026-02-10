import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword'; 
import './styles/App.css';;

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function Layout() {
  const location = useLocation();
  
  const noSidebarPages = ['/', '/login', '/register', '/forgot-password'];
  const hideSidebar = noSidebarPages.includes(location.pathname);

  return (
    <div className="app-main-layout">
      {!hideSidebar && <Sidebar />}
      
      <div className={hideSidebar ? "content-full" : "content-with-sidebar"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/procurement" element={<ProtectedRoute><Procurement /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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