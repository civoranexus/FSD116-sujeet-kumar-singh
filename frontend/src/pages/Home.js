import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-hero">
        <h1>Civora Nursery & Seeds</h1>
        <p>
          Providing Premium Quality Organic Seeds and Plant Management Solutions for a Greener Tomorrow.
        </p>
        
        <div className="hero-btn-group">
          <button onClick={() => navigate('/login')} className="btn-primary">
            Sign In to Shop
          </button>
          <button onClick={() => navigate('/register')} className="btn-secondary">
            Join Us Today
          </button>
        </div>
      </div>

      <div className="features-section">
        <h2 className="text-green">Why Choose Civora Seeds?</h2>
        <p>Our commitment to quality ensures the best growth for your garden.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>100% Certified Organic</h3>
            <p>Our seeds are sourced naturally and are completely free from harmful pesticides.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>High Germination Rate</h3>
            <p>Rigorous quality testing ensures a 99% success rate in sprouting healthy plants.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Nationwide Delivery</h3>
            <p>Reliable logistics to get your premium seeds delivered within 3-5 business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;