import React from 'react';

const Sales = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1565c0' }}>💰 Sales Tracking</h2>
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>Quick Summary:</strong> Aaj ki total sale: ₹4,500
      </div>
      <button style={{ padding: '10px 20px', backgroundColor: '#1565c0', color: 'white', border: 'none', borderRadius: '4px' }}>
        + Add New Sale
      </button>
    </div>
  );
};

export default Sales;