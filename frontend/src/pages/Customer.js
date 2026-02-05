import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Customer = () => {
    const [seeds, setSeeds] = useState([]);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('nurseryCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [showCartModal, setShowCartModal] = useState(false); 

    useEffect(() => {
        localStorage.setItem('nurseryCart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventory')
            .then(res => setSeeds(res.data))
            .catch(err => console.log(err));
    }, []);

    const addToCart = (seed) => {
        const selectedQty = parseInt(document.getElementById(`qty-${seed._id}`).value);
        if (selectedQty > seed.quantity) {
            alert("Stock kam hai!");
            return;
        }
        const cartItem = { ...seed, orderedQty: selectedQty };
        setCart([...cart, cartItem]);
        alert(`${selectedQty} Save! 🛒`);
    };

    const handleBuyNow = async (seed) => {
        const customerId = localStorage.getItem('userId');
        const qty = parseInt(document.getElementById(`qty-${seed._id}`).value);

        if (qty > seed.quantity) {
            alert("Low stock!");
            return;
        }

        const orderData = {
            customerId: customerId,
            seedId: seed._id,
            quantity: qty,
            totalPrice: seed.price * qty
        };

        try {
            await axios.post('http://localhost:5000/api/inventory/place-order', orderData);
            alert(` Order placed. ✅`);
            window.location.href = '/orders'; 
        } catch (err) {
            alert(err.response?.data?.message || "Order fail");
            if (err.response?.status === 400) {
                window.location.href = '/profile'; 
            }
        }
    };

    // --- UPDATED CART CHECKOUT (No Prompt) ---
    const handleCartCheckout = async () => {
        const customerId = localStorage.getItem('userId');

        try {
            for (const item of cart) {
                const orderData = {
                    customerId,
                    seedId: item._id,
                    quantity: item.orderedQty,
                    totalPrice: item.price * item.orderedQty
                };
                await axios.post('http://localhost:5000/api/inventory/place-order', orderData);
            }
            alert("Orders place! 📦");
            setCart([]); 
            localStorage.removeItem('nurseryCart');
            setShowCartModal(false);
            window.location.href = '/orders';
        } catch (err) {
            alert(err.response?.data?.message || "Orders fail. Check profile.");
            if (err.response?.status === 400) window.location.href = '/profile';
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="store-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2e7d32', color: 'white', padding: '15px 25px', borderRadius: '15px', marginBottom: '30px' }}>
                <h2 style={{margin: 0}}>🌱 Nursery Online Store</h2>
                <div 
                    onClick={() => setShowCartModal(true)} 
                    style={{ background: 'white', color: '#2e7d32', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    🛒 Total Items: {cart.reduce((total, item) => total + (item.orderedQty || 0), 0)}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                {seeds.map(seed => (
                    <div key={seed._id} className="seed-card" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                            <img src={seed.image || "https://via.placeholder.com/150"} alt={seed.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '15px' }}>
                            <h3>{seed.name}</h3>
                            <span className="category-badge">{seed.category}</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>₹{seed.price}</span>
                                <span style={{ fontSize: '13px', color: seed.quantity > 0 ? '#666' : 'red' }}>Stock: {seed.quantity}</span>
                            </div>
                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label>Qty:</label>
                                <input type="number" min="1" max={seed.quantity} defaultValue="1" id={`qty-${seed._id}`} style={{ width: '60px', padding: '5px' }} />
                            </div>
                            <button disabled={seed.quantity <= 0} onClick={() => addToCart(seed)} className="cart-btn" style={{ width: '100%', padding: '10px', marginTop: '15px', background: '#e8f5e9', color: '#2e7d32', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add to Cart</button>
                            <button disabled={seed.quantity <= 0} onClick={() => handleBuyNow(seed)} className="login-button" style={{ background: '#2e7d32', width: '100%', marginTop: '10px' }}>Buy Now</button>
                        </div>
                    </div>
                ))}
            </div>

            {showCartModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '25px', borderRadius: '15px', width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h3 style={{ color: '#2e7d32' }}>🛒 My Shopping Cart</h3>
                        <hr />
                        {cart.length === 0 ? <p>Aapka cart khali hai.</p> : (
                            <>
                                {cart.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                        <div><strong>{item.name}</strong> (Qty: {item.orderedQty})</div>
                                        <button onClick={() => setCart(cart.filter((_, i) => i !== index))} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button onClick={handleCartCheckout} className="btn-accept" style={{ flex: 2, padding: '12px', background: '#2e7d32', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Checkout & Order</button>
                                    <button onClick={() => setShowCartModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customer;