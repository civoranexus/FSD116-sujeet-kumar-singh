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
            const res = await axios.get('http://localhost:5000/api/procurement/all');
            setRecords(res.data);
        } catch (err) {
            console.error("Error fetching records:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/procurement/add', formData);
            alert("New Stock Procured! 🌱");
            setFormData({ itemName: '', quantity: '', unitPrice: '', supplierName: '', category: 'Seed' });
            fetchRecords();
        } catch (err) { 
            alert("Failed to add procurement record."); 
        }
    };

    return (
        <div className="procurement-container">
            <h2 className="text-green">📦 Procurement Management</h2>
            
            {/* Form Card for Adding Stock */}
            <div className="procurement-form-card">
                <h3>➕ Add New Stock Entry</h3>
                <form onSubmit={handleSubmit} className="procurement-grid">
                    <input 
                        className="proc-input"
                        placeholder="Item Name" 
                        value={formData.itemName} 
                        onChange={e => setFormData({...formData, itemName: e.target.value})} 
                        required 
                    />
                    <input 
                        className="proc-input"
                        placeholder="Quantity" 
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
                        placeholder="Supplier Name" 
                        value={formData.supplierName} 
                        onChange={e => setFormData({...formData, supplierName: e.target.value})} 
                        required 
                    />
                    <select 
                        className="proc-input"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="Seed">Seed</option>
                        <option value="Plant">Plant</option>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Tool">Tool</option>
                    </select>
                    <button type="submit" className="proc-btn">Add to Stock</button>
                </form>
            </div>

            {/* History Table Container */}
            <div className="proc-table-container">
                <h3>Purchase History</h3>
                <table className="proc-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total Cost</th>
                            <th>Supplier</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(r => (
                            <tr key={r._id}>
                                <td><b>{r.itemName}</b></td>
                                <td><span className="category-badge">{r.category}</span></td>
                                <td>{r.quantity}</td>
                                <td>₹{r.unitPrice}</td>
                                <td className="cost-text">₹{r.totalCost}</td>
                                <td>{r.supplierName}</td>
                                <td>{new Date(r.purchaseDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Procurement;