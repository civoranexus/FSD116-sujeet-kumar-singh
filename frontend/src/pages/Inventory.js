import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Inventory = () => {
  const [seeds, setSeeds] = useState([]);

  useEffect(() => {
    // Backend API se data fetch karna
    axios.get('http://localhost:5000/api/inventory')
      .then(res => setSeeds(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="inventory-container">
      <h1>Nursery Inventory</h1>
      <table>
        <thead>
          <tr><th>Seed Name</th><th>Stock</th></tr>
        </thead>
        <tbody>
          {seeds.map(seed => (
            <tr key={seed._id}>
              <td>{seed.name}</td>
              <td>{seed.quantity} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;