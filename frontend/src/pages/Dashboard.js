import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Dashboard = () => {
    const [seeds, setSeeds] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalSales: 0 });
    const [recentSales, setRecentSales] = useState([]);
    const [dailySales, setDailySales] = useState({ count: 0, revenue: 0, sales: [] }); 
    
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Inventory data (Hamesha call hoga)
                const invRes = await axios.get('http://localhost:5000/api/inventory');
                setSeeds(invRes.data);

                // 2. Admin/Staff Specific Data
                if (role === 'admin' || role === 'staff') {
                    // Saari API calls ek saath parallel mein
                    const [statsRes, historyRes, dailyRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/sales/stats'),
                        axios.get('http://localhost:5000/api/sales/history'),
                        axios.get('http://localhost:5000/api/sales/daily-sales')
                    ]);
                    
                    setStats(statsRes.data);
                    setRecentSales(historyRes.data.slice(0, 5));
                    setDailySales(dailyRes.data);
                }
            } catch (err) { 
                console.error("Dashboard Data Fetch Error:", err); 
            }
        };
        fetchDashboardData();
    }, [role]);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">🌱 Nursery Overview Dashboard</h2>
            
            {/* --- TOP STATS ROW --- */}
            <div className="stats-row">
                <div className="stat-card" style={{backgroundColor: '#E3F2FD', color: '#1976D2'}}>
                    <h3>{seeds.length}</h3>
                    <p>Seed Varieties</p>
                </div>
                
                {/* NEW: Daily Sales Card - Admin/Staff Only */}
                {(role === 'admin' || role === 'staff') && (
                    <div className="stat-card" style={{backgroundColor: '#FFF3E0', color: '#E65100'}}>
                        <h3>₹{dailySales.revenue ? dailySales.revenue.toLocaleString() : 0}</h3>
                        <p>Today's Sales ({dailySales.count || 0} orders)</p>
                    </div>
                )}

                <div className="stat-card" style={{backgroundColor: '#F1F8E9', color: '#388E3C'}}>
                    <h3>{seeds.reduce((s, i) => s + (i.quantity || 0), 0)}</h3>
                    <p>Total Stock Units</p>
                </div>
                <div className="stat-card" style={{backgroundColor: '#FFEBEE', color: '#D32F2F'}}>
                    <h3>{seeds.filter(s => s.quantity < 5).length}</h3>
                    <p>Low Stock Alerts</p>
                </div>
            </div>

            {/* --- ADMIN REVENUE CARDS --- */}
            {(role === 'admin' || role === 'staff') && (
                <div className="admin-stats-grid">
                    <div className="revenue-card">
                        <h3>Total Sales Revenue</h3>
                        <h1>₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}</h1>
                    </div>
                    <div className="order-card">
                        <h3>Total Orders</h3>
                        <h1>{stats.totalSales || 0}</h1>
                    </div>
                </div>
            )}

            {/* --- TABLES SECTION --- */}
            <div className="quick-summary-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Stock Summary */}
                <div className="report-card">
                    <h3>📦 Quick Stock Summary</h3>
                    {seeds.slice(0, 5).map(seed => (
                        <div key={seed._id} className="summary-list-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <span>{seed.name}</span>
                            <span className={seed.quantity < 5 ? 'low-stock-warning' : ''} style={{ color: seed.quantity < 5 ? 'red' : 'inherit', fontWeight: 'bold' }}>
                                {seed.quantity} {seed.quantity < 5 ? '⚠️' : ''}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Today's Sales Activity List (Added Here) */}
                {(role === 'admin' || role === 'staff') && (
                    <div className="report-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>📅 Today's Sales List</h3>
                            <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>
                                ₹{dailySales.revenue ? dailySales.revenue.toLocaleString() : 0}
                            </span>
                        </div>
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
                                            <td>{sale.customerName}</td>
                                            <td style={{ fontWeight: 'bold' }}>₹{sale.finalAmount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '10px', color: '#888' }}>No sales today yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;