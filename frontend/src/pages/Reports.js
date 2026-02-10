import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css'; 

const Reports = () => {
    const [valuation, setValuation] = useState({ totalValuation: 0, categoryWise: [] });
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const valRes = await axios.get('/api/reports/inventory-valuation');
                const anaRes = await axios.get('/api/reports/sales-analytics');
                
                setValuation(valRes.data || { totalValuation: 0, categoryWise: [] });
                setAnalytics(anaRes.data || []);
            } catch (err) {
                console.error("Cloud data sync error:", err);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="reports-container">
            <h2 className="dashboard-title">📊 Analytical & Financial Reports</h2>
            
            <div className="stats-row">
                <div className="stat-card valuation-card">
                    <h3>₹{valuation.totalValuation ? valuation.totalValuation.toLocaleString() : 0}</h3>
                    <p>Net Inventory Valuation</p>
                </div>
            </div>

            <div className="quick-summary-section">
                <div className="report-card">
                    <h3>📂 Category-wise Asset Value</h3>
                    <table className="proc-table">
                        <thead>
                            <tr>
                                <th>Category Type</th>
                                <th>Unit Stock</th>
                                <th>Market Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {valuation.categoryWise.length > 0 ? (
                                valuation.categoryWise.map(cat => (
                                    <tr key={cat._id}>
                                        <td>{cat._id}</td>
                                        <td>{cat.stock}</td>
                                        <td className="text-green">₹{cat.totalValue.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" style={{textAlign: 'center'}}>Calculating valuation...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="report-card">
                    <h3>📈 Monthly Revenue Performance</h3>
                    <div className="analytics-list">
                        {analytics.length > 0 ? (
                            analytics.map(item => (
                                <div key={item._id} className="summary-list-item">
                                    <span>Financial Month {item._id}</span>
                                    <strong className="text-blue">₹{item.monthlyRevenue.toLocaleString()}</strong>
                                </div>
                            ))
                        ) : (
                            <p style={{padding: '10px', color: '#666'}}>No sales data available for analytics yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;