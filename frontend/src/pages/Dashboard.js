import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Dashboard = () => {
    const [seeds, setSeeds] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, lowStockCount: 0 });
    const [dailySales, setDailySales] = useState({ count: 0, revenue: 0, sales: [] }); 
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, invRes] = await Promise.all([
                    axios.get('/api/inventory/admin-stats'),
                    axios.get('/api/inventory/all')
                ]);

                setStats({
                    totalRevenue: statsRes.data.totalRevenue || 0,
                    totalOrders: statsRes.data.totalOrders || 0,
                    lowStockCount: statsRes.data.lowStockCount || 0
                });

                setDailySales(statsRes.data.dailySales || { count: 0, revenue: 0, sales: [] });
                setSeeds(invRes.data || []);

            } catch (err) { 
                console.error("Dashboard Fetch Error:", err); 
            }
        };
        fetchDashboardData();
    }, [role]);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">🌱 Civora Nursery Overview Dashboard</h2>
            
            <div className="stats-row">
                <div className="stat-card" style={{backgroundColor: '#E3F2FD', color: '#1976D2'}}>
                    <h3>{seeds.length}</h3>
                    <p>Plant Varieties</p>
                </div>
                
                {(role === 'admin' || role === 'staff') && (
                    <div className="stat-card" style={{backgroundColor: '#FFF3E0', color: '#E65100'}}>
                        <h3>₹{(dailySales.revenue || 0).toLocaleString()}</h3>
                        <p>Today's Sales ({dailySales.count || 0} orders)</p>
                    </div>
                )}

                <div className="stat-card" style={{backgroundColor: '#F1F8E9', color: '#388E3C'}}>
                    <h3>{seeds.reduce((s, i) => s + (i.quantity || 0), 0)}</h3>
                    <p>Total Stock Inventory</p>
                </div>
                <div className="stat-card" style={{backgroundColor: '#FFEBEE', color: '#D32F2F'}}>
                    <h3>{stats.lowStockCount}</h3>
                    <p>Low Stock Alerts</p>
                </div>
            </div>

            {(role === 'admin' || role === 'staff') && (
                <div className="admin-stats-grid">
                    <div className="revenue-card">
                        <h3>Lifetime Sales Revenue (Delivered Only)</h3>
                        <h1>₹{(stats.totalRevenue || 0).toLocaleString()}</h1>
                    </div>
                    <div className="order-card">
                        <h3>Total Orders Processed</h3>
                        <h1>{stats.totalOrders || 0}</h1>
                    </div>
                </div>
            )}

            <div className="quick-summary-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="report-card">
                    <h3>📦 Quick Inventory Summary</h3>
                    {seeds.slice(0, 5).map(seed => (
                        <div key={seed._id} className="summary-list-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                            <span>{seed.name}</span>
                            <span style={{ color: seed.quantity < 5 ? 'red' : 'green', fontWeight: 'bold' }}>
                                {seed.quantity} {seed.quantity < 5 ? '⚠️' : ''}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="report-card">
                    <h3>📅 Today's Sales Activity</h3>
                    <table className="proc-table" style={{ width: '100%', marginTop: '10px', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                                <th>Time</th>
                                <th>Customer</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailySales.sales && dailySales.sales.length > 0 ? (
                                dailySales.sales.map(sale => (
                                    <tr key={sale._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td>{new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>{sale.customerName || 'Walk-in'}</td>
                                        <td style={{ fontWeight: 'bold', color: '#2e7d32' }}>₹{sale.finalAmount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No sales today yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;