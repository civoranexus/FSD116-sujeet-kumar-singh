import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
      <h1 style={{ color: '#2e7d32' }}>🌱 Nursery Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Total Seeds</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>1,250</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Recent Sales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>45</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Low Stock</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>12</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;