import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [seeds, setSeeds] = useState([]);

    useEffect(() => {
        // fetch from data Inventory to see dashboard 
        axios.get('http://localhost:5000/api/inventory')
            .then(res => setSeeds(res.data))
            .catch(err => console.log(err));
    }, []);

    const totalVarieties = seeds.length;
    const totalStock = seeds.reduce((sum, seed) => sum + seed.quantity, 0);
    const lowStockItems = seeds.filter(seed => seed.quantity < 5).length;

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px', color: '#2e7d32' }}>Nursery Overview Dashboard</h2>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Card 1: Total Varieties */}
                <div style={cardStyle('#E3F2FD', '#1976D2')}>
                    <h3>{totalVarieties}</h3>
                    <p>Total Seed Varieties</p>
                </div>

                {/* Card 2: Total Quantity in Nursery */}
                <div style={cardStyle('#F1F8E9', '#388E3C')}>
                    <h3>{totalStock}</h3>
                    <p>Total Seeds in Stock</p>
                </div>

                {/* Card 3: Alert for Low Stock */}
                <div style={cardStyle('#FFEBEE', '#D32F2F')}>
                    <h3>{lowStockItems}</h3>
                    <p>Low Stock Alerts (&lt; 5)</p>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>Quick Stock Summary</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {seeds.slice(0, 5).map(seed => (
                        <li key={seed._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {seed.name} - <strong>{seed.quantity} units</strong> 
                            {seed.quantity < 5 && <span style={{ color: 'red', marginLeft: '10px' }}>⚠️ Reorder Soon</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Dashboard Card Styling
const cardStyle = (bgColor, textColor) => ({
    background: bgColor,
    color: textColor,
    padding: '20px',
    borderRadius: '15px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
});

export default Dashboard;