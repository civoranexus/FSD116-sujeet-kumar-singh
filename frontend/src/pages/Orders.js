import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const customerId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/inventory/my-orders/${customerId}`);
                setOrders(res.data);
            } catch (err) {
                console.error("Orders not loaded", err);
            }
        };
        if (customerId) fetchOrders();
    }, [customerId]);


    const handleEditAddress = async (orderId, currentStatus) => {
        if (currentStatus !== 'Pending') {
            alert("Sorry Address not changes!");
            return;
        }

        const newAddress = prompt("Add New Delivery Address :");
        
        if (newAddress && newAddress.length > 5) {
            try {
                await axios.put(`http://localhost:5000/api/inventory/update-address/${orderId}`, { 
                    newAddress: newAddress 
                });
                alert("Address Add Successfully! ✅");
                window.location.reload(); 
            } catch (err) {
                alert("Address update fail: " + (err.response?.data?.message || "Server Error"));
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#2e7d32' }}>📦 My Orders</h2>
            <div className="orders-container" style={{ marginTop: '20px' }}>
                {orders.length === 0 ? <p>Order not Available!</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <thead style={{ background: '#2e7d32', color: 'white' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>Seed Name</th>
                                <th style={{ padding: '12px' }}>Quantity</th>
                                <th style={{ padding: '12px' }}>Total Price</th>
                                <th style={{ padding: '12px' }}>Delivery Address</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                    <td style={{ padding: '12px' }}>{order.seed?.name || "N/A"}</td>
                                    <td style={{ padding: '12px' }}>{order.quantity}</td>
                                    <td style={{ padding: '12px' }}>₹{order.totalPrice}</td>
                                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                                        {order.address} 
                                        {order.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleEditAddress(order._id, order.status)}
                                                style={{ marginLeft: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#1976d2', fontSize: '12px', textDecoration: 'underline' }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px', color: order.status === 'Pending' ? '#ef6c00' : '#2e7d32', fontWeight: 'bold' }}>
                                        {order.status}
                                    </td>
                                    <td style={{ padding: '12px' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Orders;