import React from 'react';

const Staff = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>👥 Staff Directory</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px' }}>
          <h4>Suresh Singh</h4>
          <p>Role: Manager</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px' }}>
          <h4>Ramesh Kumar</h4>
          <p>Role: Inventory Supervisor</p>
        </div>
      </div>
    </div>
  );
};

export default Staff;