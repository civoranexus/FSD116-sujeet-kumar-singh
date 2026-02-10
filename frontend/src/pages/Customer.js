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
        axios.get('http://localhost:5000/api/inventory/all')
            .then(res => setSeeds(res.data))
            .catch(err => console.log(err));
    }, []);

    const addToCart = (seed) => {
        const qtyInput = document.getElementById(`qty-${seed._id}`);
        const selectedQty = parseInt(qtyInput.value);

        if (selectedQty > seed.quantity) {
            alert("Insufficient stock available! Please reduce the quantity.");
            return;
        }

        const cartItem = { ...seed, orderedQty: selectedQty };
        setCart([...cart, cartItem]);
        alert(`${selectedQty} item(s) added to cart! 🛒`);
    };

    const handleBuyNow = async (seed) => {
        const customerId = localStorage.getItem('userId');
        const qty = parseInt(document.getElementById(`qty-${seed._id}`).value);

        if (qty > seed.quantity) {
            alert("Stock error: Requested quantity exceeds availability.");
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
            alert(`Order placed successfully! ✅ Check 'My Purchase History' for updates.`);
            window.location.href = '/orders'; 
        } catch (err) {
            alert(err.response?.data?.message || "Order placement failed. Please try again.");
            if (err.response?.status === 400) {
                window.location.href = '/profile'; 
            }
        }
    };

    const handleCartCheckout = async () => {
        const customerId = localStorage.getItem('userId');
        if (!customerId) return alert("Please login to place an order.");

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
            alert("All items processed! Orders placed successfully! 📦");
            setCart([]); 
            localStorage.removeItem('nurseryCart');
            setShowCartModal(false);
            window.location.href = '/orders';
        } catch (err) {
            alert(err.response?.data?.message || "Checkout failed. Ensure your profile details are complete.");
            if (err.response?.status === 400) window.location.href = '/profile';
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="store-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2e7d32', color: 'white', padding: '15px 25px', borderRadius: '15px', marginBottom: '30px' }}>
                <h2 style={{margin: 0}}>🌱 Civora Online Store</h2>
                <div 
                    onClick={() => setShowCartModal(true)} 
                    style={{ background: 'white', color: '#2e7d32', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
                >
                    🛒 Cart Items: {cart.reduce((total, item) => total + (item.orderedQty || 0), 0)}
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                {seeds.map(seed => (
                    <div key={seed._id} className="seed-card" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                            <img src={seed.image || "https://via.placeholder.com/150"} alt={seed.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '15px' }}>
                            <h3 style={{ marginBottom: '5px' }}>{seed.name}</h3>
                            <span className="category-badge" style={{ fontSize: '12px', background: '#f0f0f0', padding: '2px 8px', borderRadius: '10px' }}>{seed.category}</span>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>₹{seed.price}</span>
                                <span style={{ fontSize: '13px', color: seed.quantity > 5 ? '#666' : 'red' }}>
                                    {seed.quantity > 0 ? `Available: ${seed.quantity}` : 'Out of Stock'}
                                </span>
                            </div>

                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ fontSize: '14px' }}>Quantity:</label>
                                <input type="number" min="1" max={seed.quantity} defaultValue="1" id={`qty-${seed._id}`} style={{ width: '60px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }} />
                            </div>

                            <button disabled={seed.quantity <= 0} onClick={() => addToCart(seed)} className="cart-btn" style={{ width: '100%', padding: '10px', marginTop: '15px', background: '#e8f5e9', color: '#2e7d32', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Add to Cart</button>
                            <button disabled={seed.quantity <= 0} onClick={() => handleBuyNow(seed)} className="login-button" style={{ background: '#2e7d32', width: '100%', marginTop: '10px', borderRadius: '8px', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>Buy Now</button>
                        </div>
                    </div>
                ))}
            </div>

            {showCartModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '25px', borderRadius: '15px', width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h3 style={{ color: '#2e7d32', marginTop: 0 }}>🛒 My Shopping Cart</h3>
                        <hr />
                        {cart.length === 0 ? <p style={{ textAlign: 'center', padding: '20px' }}>Your cart is currently empty. Start shopping!</p> : (
                            <>
                                {cart.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px', alignItems: 'center' }}>
                                        <div>
                                            <strong>{item.name}</strong>
                                            <div style={{ fontSize: '12px', color: '#666' }}>Qty: {item.orderedQty} | Price: ₹{item.price * item.orderedQty}</div>
                                        </div>
                                        <button onClick={() => setCart(cart.filter((_, i) => i !== index))} style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button onClick={handleCartCheckout} className="btn-accept" style={{ flex: 2, padding: '12px', background: '#2e7d32', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Checkout & Confirm Order</button>
                                    <button onClick={() => setShowCartModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ddd', background: '#f9f9f9' }}>Close</button>
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