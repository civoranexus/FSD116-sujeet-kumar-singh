import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [valuation, setValuation] = useState({ totalValuation: 0, categoryWise: [] });
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const valRes = await axios.get('http://localhost:5000/api/reports/inventory-valuation');
            const anaRes = await axios.get('http://localhost:5000/api/reports/sales-analytics');
            setValuation(valRes.data);
            setAnalytics(anaRes.data);
        };
        fetchReports();
    }, []);

    return (
        <div className="reports-container" style={{ padding: '20px' }}>
            <h2>📊 Analytical & Financial Reports</h2>
            
            <div className="stats-row">
                <div className="stat-card" style={{ background: '#1a237e', color: 'white' }}>
                    <h3>₹{valuation.totalValuation.toLocaleString()}</h3>
                    <p>Total Inventory Valuation</p>
                </div>
            </div>

            <div className="quick-summary-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Category Wise Valuation */}
                <div className="report-card">
                    <h3>📂 Category-wise Value</h3>
                    <table className="proc-table">
                        <thead>
                            <tr><th>Category</th><th>Stock</th><th>Value</th></tr>
                        </thead>
                        <tbody>
                            {valuation.categoryWise.map(cat => (
                                <tr key={cat._id}>
                                    <td>{cat._id}</td>
                                    <td>{cat.stock}</td>
                                    <td>₹{cat.totalValue.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Monthly Sales Performance */}
                <div className="report-card">
                    <h3>📈 Monthly Revenue</h3>
                    <div className="analytics-list">
                        {analytics.map(item => (
                            <div key={item._id} className="summary-list-item">
                                <span>Month {item._id}</span>
                                <strong>₹{item.monthlyRevenue.toLocaleString()}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;