import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Inventory = () => {
    const [seeds, setSeeds] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '', 
        price: '',
        image: '' 
    });

    const fetchSeeds = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory');
            setSeeds(res.data);
        } catch (err) {
            console.error("Data not found:", err);
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
                alert("Seed Successfully Added! ✅");
                // FIX: Image ko bhi reset kar diya
                setFormData({ name: '', category: '', quantity: '', price: '', image: '' }); 
                fetchSeeds(); 
            }
        } catch (err) {
            alert("Seed not Add!" + (err.response?.data?.message || "Server Error"));
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#2e7d32' }}>Nursery Inventory Management</h2>

            <div style={{ background: '#f1f8e9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Add New Seed Item</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <input name="name" placeholder="Seed Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                    <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required style={inputStyle} />
                    <input name="quantity" type="number" placeholder="Qty" value={formData.quantity} onChange={handleChange} required style={inputStyle} />
                    <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required style={inputStyle} />
                    <input 
                        name="image" 
                        placeholder="Image URL" 
                        value={formData.image} 
                        onChange={handleChange} 
                        style={{ ...inputStyle, width: '250px' }} 
                    />
                    <button type="submit" style={buttonStyle}>Add Seed</button>
                </form>
            </div>

            <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#2e7d32', color: 'white' }}>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    {seeds.length > 0 ? seeds.map((seed) => (
                        <tr key={seed._id}>
                            <td>
                                <img src={seed.image || "https://via.placeholder.com/50"} alt="seed" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} />
                            </td>
                            <td>{seed.name}</td>
                            <td>{seed.category}</td>
                            <td>{seed.quantity}</td>
                            <td>{seed.price}</td>
                        </tr>
                    )) : <tr><td colSpan="5" style={{ textAlign: 'center' }}>Data not found.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Inventory;