import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Inventory = () => {
    const [seeds, setSeeds] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: ''
    });

    // 1. Data load karne ke liye
    const fetchSeeds = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory');
            setSeeds(res.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchSeeds();
    }, []);

    // 2. Form input handle karne ke liye
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Data submit karne ke liye
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/inventory/add', formData);
            alert("Beej kamyabi se add ho gaya!");
            setFormData({ name: '', category: '', quantity: '', price: '' }); // Form clear karein
            fetchSeeds(); // Table refresh karein
        } catch (err) {
            console.error("Error adding seed:", err);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Nursery Inventory Management</h2>

            {/* --- Naya Beej Add Karne Ka Form --- */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>Naya Seed Dalein</h3>
                <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="Seed Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                    <input name="category" placeholder="Category (e.g. Flower)" value={formData.category} onChange={handleChange} required style={inputStyle} />
                    <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required style={inputStyle} />
                    <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required style={inputStyle} />
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>Add Seed</button>
                </form>
            </div>

            {/* --- Inventory Table --- */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    {seeds.map((seed) => (
                        <tr key={seed._id}>
                            <td>{seed.name}</td>
                            <td>{seed.category}</td>
                            <td>{seed.quantity}</td>
                            <td>{seed.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    const deleteSeed = async (id) => {
        if (window.confirm("Kya aap ise delete karna chahte hain?")) {
            try {
                await axios.delete(`http://localhost:5000/api/inventory/${id}`);
                fetchSeeds(); // Delete ke baad list refresh karein
            } catch (err) {
                console.error("Delete karne mein galti:", err);
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* ... Form wala part same rahega ... */}

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price (₹)</th>
                        <th>Action</th> {/* Naya Column */}
                    </tr>
                </thead>
                <tbody>
                    {seeds.map((seed) => (
                        <tr key={seed._id}>
                            <td>{seed.name}</td>
                            <td>{seed.category}</td>
                            <td>{seed.quantity}</td>
                            <td>{seed.price}</td>
                            <td>
                                <button 
                                    onClick={() => deleteSeed(seed._id)} 
                                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};

// Simple CSS for inputs
const inputStyle = { marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };

export default Inventory;