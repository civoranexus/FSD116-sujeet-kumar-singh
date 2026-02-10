import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css'; 

const Inventory = () => {
    const [seeds, setSeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '', 
        price: '',
        image: '' 
    });

    const fetchSeeds = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/inventory/all');
            setSeeds(res.data);
        } catch (err) {
            console.error("Inventory Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeeds();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/inventory/add', formData);
            if (res.status === 201) {
                alert("New Stock Successfully Added! ✅");
                setFormData({ name: '', category: '', quantity: '', price: '', image: '' }); 
                fetchSeeds(); 
            }
        } catch (err) {
            alert("Submission Failed: " + (err.response?.data?.message || "Internal Server Error"));
        }
    };

    return (
        <div className="inventory-wrapper">
            <header className="inventory-header">
                <h2>🌿 Nursery Inventory Dashboard</h2>
                <p>Manage your seeds, stock levels, and pricing efficiently.</p>
            </header>

            <section className="form-section card-shadow">
                <div className="section-title">
                    <span className="icon-badge">➕</span>
                    <h3>Add New Inventory Item</h3>
                </div>
                <form onSubmit={handleSubmit} className="modern-form-grid">
                    <div className="input-group">
                        <label>Item Name</label>
                        <input name="name" placeholder="Ex: Marigold Seeds" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="Flowers">Flowers</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Tools">Tools</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Quantity</label>
                        <input name="quantity" type="number" placeholder="00" value={formData.quantity} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Price (₹)</label>
                        <input name="price" type="number" placeholder="₹ 0.00" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="input-group full-width">
                        <label>Image URL</label>
                        <input name="image" placeholder="https://image-link.com/photo.jpg" value={formData.image} onChange={handleChange} />
                    </div>
                    <button type="submit" className="submit-btn">Register Item</button>
                </form>
            </section>

            <section className="table-section card-shadow">
                <div className="section-title">
                    <span className="icon-badge">📋</span>
                    <h3>Current Stock Overview</h3>
                </div>
                
                {loading ? (
                    <div className="loader-text">Fetching Inventory Data...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seeds.length > 0 ? seeds.map((seed) => (
                                    <tr key={seed._id} className={seed.quantity < 10 ? 'row-warning' : ''}>
                                        <td>
                                            <div className="img-container">
                                                <img src={seed.image || "https://via.placeholder.com/50"} alt="item" />
                                            </div>
                                        </td>
                                        <td className="bold-text">{seed.name}</td>
                                        <td><span className="tag-category">{seed.category}</span></td>
                                        <td>
                                            <div className={`status-pill ${seed.quantity < 10 ? 'pill-low' : 'pill-ok'}`}>
                                                {seed.quantity} Units {seed.quantity < 10 && '⚠️'}
                                            </div>
                                        </td>
                                        <td className="price-text">₹{seed.price}</td>
                                        <td>
                                            <button className="edit-icon-btn" title="Edit Item">✏️</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="empty-msg">No inventory records found. Add your first item above!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Inventory;