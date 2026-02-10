import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Procurement = () => {
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({
        itemName: '', quantity: '', unitPrice: '', supplierName: '', category: 'Seed'
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await axios.get('/api/procurement/all');
            setRecords(res.data);
        } catch (err) {
            console.error("Database Connection Error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/procurement/add', formData);
            alert("New Inventory Stock Procured Successfully! 🌱");
            setFormData({ itemName: '', quantity: '', unitPrice: '', supplierName: '', category: 'Seed' });
            fetchRecords(); 
        } catch (err) { 
            alert(err.response?.data?.message || "Failed to log procurement record. Please check server status."); 
        }
    };

    return (
        <div className="procurement-container">
            <h2 className="text-green">📦 Procurement & Supply Management</h2>
            
            <div className="procurement-form-card">
                <h3>➕ Register New Purchase Entry</h3>
                <form onSubmit={handleSubmit} className="procurement-grid">
                    <input 
                        className="proc-input"
                        placeholder="Item Name (e.g. Organic Compost)" 
                        value={formData.itemName} 
                        onChange={e => setFormData({...formData, itemName: e.target.value})} 
                        required 
                    />
                    <input 
                        className="proc-input"
                        placeholder="Quantity Purchased" 
                        type="number" 
                        value={formData.quantity} 
                        onChange={e => setFormData({...formData, quantity: e.target.value})} 
                        required 
                    />
                    <input 
                        className="proc-input"
                        placeholder="Unit Price (₹)" 
                        type="number" 
                        value={formData.unitPrice} 
                        onChange={e => setFormData({...formData, unitPrice: e.target.value})} 
                        required 
                    />
                    <input 
                        className="proc-input"
                        placeholder="Supplier/Vendor Name" 
                        value={formData.supplierName} 
                        onChange={e => setFormData({...formData, supplierName: e.target.value})} 
                        required 
                    />
                    <select 
                        className="proc-input"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="Seed">Seeds Variety</option>
                        <option value="Plant">Live Plants</option>
                        <option value="Fertilizer">Fertilizers/Soil</option>
                        <option value="Tool">Gardening Tools</option>
                    </select>
                    <button type="submit" className="proc-btn">Log Purchase Entry</button>
                </form>
            </div>

            <div className="proc-table-container">
                <h3>Supplier Purchase History (Cloud Logs)</h3>
                <table className="proc-table">
                    <thead>
                        <tr>
                            <th>Resource Name</th>
                            <th>Category</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total Investment</th>
                            <th>Vendor</th>
                            <th>Log Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? records.map(r => (
                            <tr key={r._id}>
                                <td><b>{r.itemName}</b></td>
                                <td><span className="category-badge">{r.category}</span></td>
                                <td>{r.quantity}</td>
                                <td>₹{r.unitPrice}</td>
                                <td className="cost-text" style={{fontWeight: 'bold', color: '#2e7d32'}}>
                                    ₹{r.totalCost || (r.quantity * r.unitPrice)}
                                </td>
                                <td>{r.supplierName}</td>
                                <td>{new Date(r.purchaseDate).toLocaleDateString('en-GB')}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No procurement logs found in the system.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Procurement;