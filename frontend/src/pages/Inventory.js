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

    // 1. Data Fetch 
    const fetchSeeds = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory');
            setSeeds(res.data);
        } catch (err) {
            console.error("Data load nahi ho paya:", err);
        }
    };

    useEffect(() => {
        fetchSeeds();
    }, []);

    // 2. Input change handle 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submit Data:", formData);

    try {
        const res = await axios.post('http://localhost:5000/api/inventory/add', formData);
        
        if (res.status === 201) {
            alert("Beej Successfully Add Ho Gaya! ✅");
            setFormData({ name: '', category: '', quantity: '', price: '' }); // Form reset
            fetchSeeds(); // List refresh
        }
    } catch (err) {
        console.error("Frontend Error:", err.response?.data);
        alert("Add nahi ho paya: " + (err.response?.data?.message || "Server Error"));
    }
};

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#2e7d32' }}>Nursery Inventory Management</h2>

            {/* --- Add Seed Form --- */}
            <div style={{ background: '#f1f8e9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Add New Seed Item</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        name="name" 
                        placeholder="Seed Name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required style={inputStyle} 
                    />
                    <input 
                        name="category" 
                        placeholder="Category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        required style={inputStyle} 
                    />
                    <input 
                        name="quantity" 
                        type="number" 
                        placeholder="Quantity" 
                        value={formData.quantity} 
                        onChange={handleChange} 
                        required style={inputStyle}
                    />
                    
                    <input 
                        name="price" 
                        type="number" 
                        placeholder="Price"
                        value={formData.price} 
                        onChange={handleChange} 
                        required style={inputStyle} 
                    />

                    <button 
                        type="submit" 
                        style={buttonStyle}>Add Seed
                    </button>

                    <input 
                        className="login-input" 
                        placeholder="Image URL (Google se link copy karein)" 
                        value={formData.image} 
                        onChange={e => setFormData(
                            {...formData, image: e.target.value}
                            )} 
                    />
                </form>
            </div>

            {/* --- Inventory Table --- */}
            <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#2e7d32', color: 'white' }}>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    {seeds.length > 0 ? seeds.map((seed) => (
                        <tr key={seed._id}>
                            <td>{seed.name}</td>
                            <td>{seed.category}</td>
                            <td>{seed.quantity}</td>
                            <td>{seed.price}</td>
                        </tr>
                    )) : <tr><td colSpan="4" style={{ textAlign: 'center' }}>Koi data nahi mila. Pehle add karein!</td></tr>}
                </tbody>
            </table>
        </div>

);
};

const inputStyle = { padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '150px' };
const buttonStyle = { padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Inventory;