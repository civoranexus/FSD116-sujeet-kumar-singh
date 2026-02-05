import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [seeds, setSeeds] = useState([]);
    const [adminStats, setAdminStats] = useState({
        totalRevenue: 0,
        pendingOrders: 0
    });
    
    const role = localStorage.getItem('role');

    useEffect(() => {
        // 1.Seed list 
        axios.get('http://localhost:5000/api/inventory')
            .then(res => setSeeds(res.data))
            .catch(err => console.log(err));

        // 2.  Admin/Staff
        if (role === 'admin' || role === 'staff') {
            axios.get('http://localhost:5000/api/inventory/admin-stats', {
                headers: { role: localStorage.getItem('role') }
            })
            .then(res => {
                setAdminStats({
                    totalRevenue: res.data.totalRevenue,
                    pendingOrders: res.data.pendingOrders
                });
            })
            .catch(err => console.log("Stats fetch failed", err));
        }
    }, [role]);

    const totalVarieties = seeds.length;
    const totalStock = seeds.reduce((sum, seed) => sum + seed.quantity, 0);
    const lowStockItemsList = seeds.filter(seed => seed.quantity < 5);

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px', color: '#2e7d32' }}>🌱 Nursery Overview Dashboard</h2>
            
            {/* General Stats (Visible to All or Admin) */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={cardStyle('#E3F2FD', '#1976D2')}>
                    <h3>{totalVarieties}</h3>
                    <p>Seed Varieties</p>
                </div>

                <div style={cardStyle('#F1F8E9', '#388E3C')}>
                    <h3>{totalStock}</h3>
                    <p>Total Stock</p>
                </div>

                
                <div style={cardStyle('#FFEBEE', '#D32F2F')}>
                    <h3>{lowStockItemsList.length}</h3>
                    <p>Low Stock Alerts</p>
                </div>
            </div>

            {/* --- ADMIN ONLY SECTION --- */}
            {(role === 'admin' || role === 'staff') && (
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ color: '#1565c0' }}>📊 Business Report </h3>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                        <div style={cardStyle('#E8EAF6', '#283593')}>
                            <h3 style={{ color: '#2e7d32' }}>₹{adminStats.totalRevenue}</h3>
                            <p>Total Sales Revenue</p>
                        </div>
                        <div style={cardStyle('#FFF3E0', '#E65100')}>
                            <h3>{adminStats.pendingOrders}</h3>
                            <p>Pending Orders</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Summary Section */}
            <div style={{ marginTop: '40px' }}>
                <h3>📦 Quick Stock Summary</h3>
                <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    {seeds.slice(0, 8).map(seed => (
                        <div key={seed._id} style={{ 
                            padding: '12px 20px', 
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{seed.name}</span>
                            <span>
                                <strong style={{ color: seed.quantity < 5 ? '#D32F2F' : '#333' }}>
                                    {seed.quantity} units
                                </strong>
                                {seed.quantity < 5 && (
                                    <span style={{ 
                                        marginLeft: '10px', 
                                        padding: '2px 8px', 
                                        background: '#FFEBEE', 
                                        color: '#D32F2F', 
                                        borderRadius: '5px',
                                        fontSize: '12px'
                                    }}>
                                        ⚠️ Reorder
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
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
    minWidth: '180px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: `1px solid ${textColor}22`
});

export default Dashboard;