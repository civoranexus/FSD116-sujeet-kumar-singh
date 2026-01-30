import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* 🌿 Hero Section */}
      <div style={{ 
        height: '60vh', 
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' 
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Grow Your Own Garden</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Premium Quality Seeds for Every Season</p>
        <button 
          onClick={() => navigate('/login')} 
          style={{ padding: '12px 30px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '30px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Login to Shop Now
        </button>
      </div>

      {/* 🌱 About Seeds Section */}
      <div style={{ padding: '50px 20px', textAlign: 'center', background: 'white' }}>
        <h2 style={{ color: '#2e7d32' }}>Why Choose Our Seeds?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '30px' }}>
          <div style={featureStyle}>
            <h3>🌱 100% Organic</h3>
            <p>Our seeds are natural and free from harmful chemicals.</p>
          </div>
          <div style={featureStyle}>
            <h3>📈 High Germination</h3>
            <p>99% success rate in growing healthy plants.</p>
          </div>
          <div style={featureStyle}>
            <h3>🚚 Fast Delivery</h3>
            <p>Get your seeds delivered to your doorstep in 3-5 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const featureStyle = { padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', background: '#f9f9f9' };

export default Home;