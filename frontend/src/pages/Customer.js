import React, { useState } from 'react';
import '../styles/App.css';

const Customer = () => {
  const [seeds] = useState([
    { id: 1, name: 'Tomato Hybrid', price: 150, image: '🌱' },
    { id: 2, name: 'Marigold Flower', price: 200, image: '🌼' },
    { id: 3, name: 'Neem Seeds', price: 100, image: '🌳' },
    { id: 4, name: 'Rose Plant', price: 350, image: '🌹' },
  ]);

  const [cart, setCart] = useState([]);
  const [orders] = useState([
    { id: 'ORD101', item: 'Sunflower Seeds', status: 'Shipped', date: '2026-01-28' },
    { id: 'ORD102', item: 'Rose Plant', status: 'Processing', date: '2026-01-29' },
  ]);

  const addToCart = (seed) => {
    setCart([...cart, seed]);
  };

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      
      {/* 🟢 NEW TOP HEADER WITH CART */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#2e7d32', 
        color: 'white', 
        padding: '15px 25px', 
        borderRadius: '10px', 
        marginBottom: '30px',
        position: 'sticky',
        top: '0',
        zIndex: 100
      }}>
        <h2 style={{ margin: 0 }}>🌱 Nursery Store</h2>
        
        {/* CART ICON ON TOP RIGHT */}
        <div style={{ 
          background: 'white', 
          color: '#2e7d32', 
          padding: '8px 20px', 
          borderRadius: '25px', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          🛒 Cart <span style={{ background: '#e64a19', color: 'white', padding: '2px 8px', borderRadius: '50%', fontSize: '14px' }}>
            {cart.length}
          </span>
        </div>
      </div>

      {/* 🛒 SHOPPING SECTION */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ borderLeft: '5px solid #2e7d32', paddingLeft: '10px' }}>Our Best Seeds</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {seeds.map(seed => (
            <div key={seed.id} className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', transition: '0.3s' }}>
              <div style={{ fontSize: '50px' }}>{seed.image}</div>
              <h4 style={{ margin: '10px 0' }}>{seed.name}</h4>
              <p style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '18px' }}>₹{seed.price}</p>
              <button 
                onClick={() => addToCart(seed)}
                style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
              >
                + Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📦 ORDER TRACKING SECTION */}
      <div style={{ marginTop: '50px' }}>
        <h3 style={{ borderLeft: '5px solid #ef6c00', paddingLeft: '10px' }}>My Orders</h3>
        <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '15px' }}>Order ID</th>
                <th style={{ padding: '15px' }}>Seed Name</th>
                <th style={{ padding: '15px' }}>Status</th>
                <th style={{ padding: '15px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{order.id}</td>
                  <td style={{ padding: '15px' }}>{order.item}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      background: order.status === 'Shipped' ? '#e8f5e9' : '#fff3e0',
                      color: order.status === 'Shipped' ? '#2e7d32' : '#ef6c00'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customer;