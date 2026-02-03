import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Customer = () => {
    const [seeds, setSeeds] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventory')
            .then(res => setSeeds(res.data))
            .catch(err => console.log(err));
    }, []);

    const addToCart = (seed) => {
        setCart([...cart, seed]);
        alert(`${seed.name} cart mein add ho gaya!`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="store-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2e7d32', color: 'white', padding: '15px 25px', borderRadius: '15px', marginBottom: '30px' }}>
                <h2 style={{margin: 0}}>🌱 Nursery Online Store</h2>
                <div style={{ background: 'white', color: '#2e7d32', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                    🛒 Cart: {cart.length}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                {seeds.map(seed => (
                    <div key={seed._id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: '0.3s' }}>
                        {/* Image Section */}
                        <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                            <img 
                                src={seed.image || "https://via.placeholder.com/150"} 
                                alt={seed.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Content Section */}
                        <div style={{ padding: '15px' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{seed.name}</h3>
                            <span style={{ background: '#f0f0f0', padding: '3px 10px', borderRadius: '15px', fontSize: '12px' }}>{seed.category}</span>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>₹{seed.price}</span>
                                <span style={{ fontSize: '13px', color: seed.quantity > 0 ? '#666' : 'red' }}>
                                    {seed.quantity > 0 ? `Stock: ${seed.quantity}` : 'Out of Stock'}
                                </span>
                            </div>

                            <button 
                                disabled={seed.quantity <= 0}
                                onClick={() => addToCart(seed)}
                                style={{ 
                                    width: '100%', 
                                    marginTop: '15px', 
                                    padding: '10px', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    background: seed.quantity > 0 ? '#2e7d32' : '#ccc',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {seed.quantity > 0 ? "Add to Cart" : "Finished"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customer;