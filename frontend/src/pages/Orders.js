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
                ? `/api/inventory/all-orders` 
                : `/api/inventory/my-orders/${customerId}`;
            
            const res = await axios.get(url);
            setOrders(res.data);
        } catch (err) {
            console.error("Orders sync failed with Atlas database", err);
        }
    };

    useEffect(() => {
        if (customerId || role === 'admin' || role === 'staff') fetchOrders();
    }, [customerId, role]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/inventory/update-status/${orderId}`, { 
                status: newStatus 
            });
            alert(`Order status updated to ${newStatus} successfully! ✅`);
            fetchOrders();
        } catch (err) {
            alert("Error updating order status in database.");
        }
    };

    const handlePrintReceipt = (order) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${order._id}</title>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; }
                        .invoice-box { border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); padding: 30px; border-radius: 10px; }
                        .header { color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
                        .details { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; }
                        th { background-color: #f9f9f9; color: #2e7d32; }
                        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; color: #2e7d32; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="invoice-box">
                        <div class="header"><h1>Civora Nursery</h1><p>Official Purchase Invoice</p></div>
                        <div class="details">
                            <div><strong>Billed To:</strong><br>${order.customer?.name || 'Valued Customer'}<br>${order.address}</div>
                            <div><strong>Order ID:</strong> ${order._id.substring(0, 8)}...<br><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</div>
                        </div>
                        <table>
                            <thead><tr><th>Item Description</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
                            <tbody>
                                <tr>
                                    <td>${order.seed?.name || 'Seeds/Plants'}</td>
                                    <td>${order.quantity}</td>
                                    <td>₹${order.totalPrice / order.quantity}</td>
                                    <td>₹${order.totalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="total">Amount Paid: ₹${order.totalPrice}</div>
                        <div class="footer">Thank you for shopping with Civora Nursery! Keep Growing.</div>
                    </div>
                    <script>window.onload = function() { window.print(); window.close(); }</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleEditAddress = (orderId, currentStatus) => {
        if (currentStatus !== 'Pending') {
            alert("This order is already being processed and the address cannot be changed.");
            return;
        }
        navigate('/profile', { state: { targetOrderId: orderId } });
    };

    return (
        <div className="orders-page">
            <h2 className={role === 'customer' ? 'text-green' : 'text-blue'}>
                {role === 'customer' ? '📦 My Purchase History' : '📋 Order Management Systems'}
            </h2>
            
            

            <div className="orders-container">
                {orders.length === 0 ? <p className="no-data">No orders found in the database.</p> : (
                    <table className="custom-table">
                        <thead className={role === 'customer' ? 'bg-green' : 'bg-blue'}>
                            <tr>
                                <th>Item Name</th>
                                {role !== 'customer' && <th>Customer Name</th>}
                                <th>Qty</th>
                                <th>Total Bill</th>
                                <th>Shipping Address</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td><strong>{order.seed?.name || "N/A"}</strong></td>
                                    {role !== 'customer' && <td>{order.customer?.name || "Member"}</td>}
                                    <td>{order.quantity}</td>
                                    <td>₹{order.totalPrice}</td>
                                    <td className="address-cell">
                                        <div style={{fontSize: '13px'}}>{order.address}</div>
                                        {role === 'customer' && order.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleEditAddress(order._id, order.status)} 
                                                className="edit-link"
                                                style={{marginTop: '5px', display: 'block', border: 'none', background: 'none', color: '#2e7d32', cursor: 'pointer', fontSize: '12px'}}
                                            >
                                                Edit Address
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
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
                                                <button onClick={() => handlePrintReceipt(order)} className="btn-receipt">📄 Download Invoice</button>
                                            ) : (
                                                role === 'customer' && <span className="order-date">Placed: {new Date(order.orderDate).toLocaleDateString()}</span>
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