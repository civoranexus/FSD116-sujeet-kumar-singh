import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/App.css';

const Sales = () => {
    const [seeds, setSeeds] = useState([]);
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({ name: '', mobile: '' });
    const [selectedSeed, setSelectedSeed] = useState('');
    const [sellQty, setSellQty] = useState(1);

    useEffect(() => {
        // Updated API endpoint to match your new structure
        axios.get('http://localhost:5000/api/inventory/all')
             .then(res => setSeeds(res.data));
    }, []);

    // --- Add to Cart Logic ---
    const addToCart = () => {
        const item = seeds.find(s => s._id === selectedSeed);
        if (!item) return alert("Pehle beej chunein!");
        if (item.stock < sellQty) return alert("Itna stock nahi hai!");

        const cartItem = {
            seedId: item._id,
            name: item.name,
            quantity: Number(sellQty),
            price: item.price,
            total: item.price * sellQty
        };

        setCart([...cart, cartItem]);
        setSelectedSeed('');
        setSellQty(1);
    };

    // --- Generate PDF Invoice ---
    const generateInvoice = (saleData) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("NURSERY MANAGEMENT SYSTEM", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Customer: ${saleData.customerName}`, 20, 40);
        doc.text(`Mobile: ${saleData.customerMobile}`, 20, 48);
        doc.text(`Date: ${new Date().toLocaleString()}`, 140, 40);

        doc.autoTable({
            startY: 60,
            head: [['Item Name', 'Qty', 'Price', 'Total']],
            body: saleData.items.map(i => [i.name, i.quantity, `Rs.${i.price}`, `Rs.${i.total}`]),
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Grand Total: Rs. ${saleData.finalAmount}`, 140, finalY);
        doc.save(`Invoice_${saleData.customerName}.pdf`);
    };

    // --- Handle Final Sale ---
    const handleSale = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Cart khali hai!");

        const saleData = {
            customerName: customer.name,
            customerMobile: customer.mobile,
            items: cart,
            subTotal: cart.reduce((acc, curr) => acc + curr.total, 0),
            finalAmount: cart.reduce((acc, curr) => acc + curr.total, 0),
        };

        try {
            await axios.post('http://localhost:5000/api/sales/create', saleData);
            alert("Sale Successful! Stock updated and Invoice generating...");
            generateInvoice(saleData); // Automatically download invoice
            setCart([]);
            setCustomer({ name: '', mobile: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Sale failed");
        }
    };

    return (
        <div className="procurement-container">
            <h2 className="text-green">🛒 Advanced Billing (POS)</h2>
            
            <div className="report-grid">
                {/* Section 1: Customer & Item Selection */}
                <div className="report-card">
                    <h3>Sale Details</h3>
                    <input className="proc-input" placeholder="Customer Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} style={{width: '95%', marginBottom: '10px'}} />
                    <input className="proc-input" placeholder="Mobile" value={customer.mobile} onChange={e => setCustomer({...customer, mobile: e.target.value})} style={{width: '95%', marginBottom: '20px'}} />
                    
                    <select className="proc-input" value={selectedSeed} onChange={(e) => setSelectedSeed(e.target.value)} style={{width: '100%', marginBottom: '10px'}}>
                        <option value="">Beej Chunein (Select Seed)</option>
                        {seeds.map(s => <option key={s._id} value={s._id}>{s.name} (Stock: {s.stock})</option>)}
                    </select>
                    
                    <input className="proc-input" type="number" value={sellQty} onChange={(e) => setSellQty(e.target.value)} min="1" style={{width: '40%', marginRight: '10px'}} />
                    <button onClick={addToCart} className="proc-btn">Add to Bill</button>
                </div>

                {/* Section 2: Bill Summary */}
                <div className="report-card">
                    <h3>Current Bill</h3>
                    <table className="proc-table">
                        <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}><td>{item.name}</td><td>{item.quantity}</td><td>Rs.{item.total}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <h3 style={{textAlign: 'right'}}>Total: Rs. {cart.reduce((acc, curr) => acc + curr.total, 0)}</h3>
                    <button onClick={handleSale} className="login-button" style={{width: '100%', background: '#2e7d32'}}>Confirm Sale & Print Invoice</button>
                </div>
            </div>
        </div>
    );
};

export default Sales;