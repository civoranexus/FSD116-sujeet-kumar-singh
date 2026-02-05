import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/App.css'; 

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const customerId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const url = (role === 'admin' || role === 'staff') 
                ? `http://localhost:5000/api/inventory/all-orders` 
                : `http://localhost:5000/api/inventory/my-orders/${customerId}`;
            
            const res = await axios.get(url);
            setOrders(res.data);
        } catch (err) {
            console.error("Orders not loaded", err);
        }
    };

    useEffect(() => {
        if (customerId || role === 'admin' || role === 'staff') fetchOrders();
    }, [customerId, role]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/inventory/update-status/${orderId}`, { 
                status: newStatus 
            });
            alert(`Order status updated to ${newStatus} ✅`);
            fetchOrders();
        } catch (err) {
            alert("Status update failed!");
        }
    };

    const handlePrintReceipt = (order) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt - ${order._id}</title>
                    <style>
                        body { font-family: sans-serif; padding: 30px; line-height: 1.6; color: #333; }
                        .receipt-card { border: 2px solid #2e7d32; padding: 25px; border-radius: 10px; }
                        .header { text-align: center; color: #2e7d32; border-bottom: 2px solid #2e7d32; margin-bottom: 20px; }
                        .meta { display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 25px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        th { background-color: #f4f4f4; }
                        .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 15px; color: #2e7d32; }
                    </style>
                </head>
                <body>
                    <div class="receipt-card">
                        <div class="header"><h1>🌱 Welcome to Nursery</h1><p>Order Receipt</p></div>
                        <div class="meta">
                            <div><strong>Delivery To:</strong><br>${order.customer?.name || 'Customer'}<br>${order.address}</div>
                            <div><strong>Order ID:</strong> ${order._id}<br><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</div>
                        </div>
                        <table>
                            <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                            <tbody><tr><td>${order.seed?.name}</td><td>${order.quantity}</td><td>₹${order.totalPrice}</td></tr></tbody>
                        </table>
                        <div class="total">Grand Total: ₹${order.totalPrice}</div>
                    </div>
                    <script>window.onload = function() { window.print(); window.close(); }</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };


    const handleEditAddress = (orderId, currentStatus) => {
        if (currentStatus !== 'Pending') {
            alert("Sorry Address is not change.");
            return;
        }
        
        navigate('/profile', { state: { targetOrderId: orderId } });
    };

    return (
        <div className="orders-page">
            <h2 className={role === 'customer' ? 'text-green' : 'text-blue'}>
                {role === 'customer' ? '📦 My Orders' : '📋 Order Management'}
            </h2>
            
            <div className="orders-container">
                {orders.length === 0 ? <p>Abhi koi order nahi hai.</p> : (
                    <table className="custom-table">
                        <thead className={role === 'customer' ? 'bg-green' : 'bg-blue'}>
                            <tr>
                                <th>Seed Name</th>
                                {role !== 'customer' && <th>Customer</th>}
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Delivery Address</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order.seed?.name || "N/A"}</td>
                                    {role !== 'customer' && <td>{order.customer?.name || "User"}</td>}
                                    <td>{order.quantity}</td>
                                    <td>₹{order.totalPrice}</td>
                                    <td className="address-cell">
                                        <div style={{fontSize: '13px'}}>{order.address}</div>
                                        {role === 'customer' && order.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleEditAddress(order._id, order.status)} 
                                                className="edit-link"
                                                style={{marginTop: '5px', display: 'block'}}
                                            >
                                                Edit Address
                                            </button>
                                        )}
                                    </td>
                                    <td className={`status-text ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </td>
                                    <td>
                                        <div className="action-stack">
                                            {role !== 'customer' && (
                                                <div className="btn-group">
                                                    {order.status === 'Pending' && <button onClick={() => handleUpdateStatus(order._id, 'Accepted')} className="btn-accept">Accept</button>}
                                                    {order.status === 'Accepted' && <button onClick={() => handleUpdateStatus(order._id, 'Shipped')} className="btn-ship">Ship</button>}
                                                    {order.status === 'Shipped' && <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="btn-deliver">Deliver</button>}
                                                </div>
                                            )}

                                            {order.status !== 'Pending' ? (
                                                <button onClick={() => handlePrintReceipt(order)} className="btn-receipt">📄 Receipt</button>
                                            ) : (
                                                role === 'customer' && <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </td>
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