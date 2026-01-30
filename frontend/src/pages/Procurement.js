import React from 'react';

const Procurement = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🚜 Seed Procurement</h2>
      <p>Naye seeds kharidne ka record yahan rakhein.</p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input type="text" placeholder="Vendor Name" style={{ padding: '8px' }} />
        <input type="text" placeholder="Seed Variety" style={{ padding: '8px' }} />
        <input type="number" placeholder="Weight (kg)" style={{ padding: '8px' }} />
        <button style={{ padding: '10px', backgroundColor: '#2e7d32', color: 'white', border: 'none' }}>
          Save Procurement
        </button>
      </form>
    </div>
  );
};

export default Procurement;