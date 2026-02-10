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
        axios.get('/api/inventory/all')
             .then(res => setSeeds(res.data))
             .catch(err => console.error("Database sync error", err));
    }, []);

    const addToCart = () => {
        const item = seeds.find(s => s._id === selectedSeed);
        if (!item) return alert("Please select a seed variety first!");
        
        if (item.quantity < sellQty) return alert("Insufficient stock in inventory!");

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

    const generateInvoice = (saleData) => {
        const doc = new jsPDF();
        
        doc.setFillColor(46, 125, 50); 
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("CIVORA NURSERY - INVOICE", 105, 25, { align: "center" });
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`Customer: ${saleData.customerName}`, 20, 50);
        doc.text(`Contact: ${saleData.customerMobile}`, 20, 58);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 140, 50);

        doc.autoTable({
            startY: 70,
            head: [['Item Description', 'Unit Price', 'Qty', 'Subtotal']],
            body: saleData.items.map(i => [i.name, `Rs.${i.price}`, i.quantity, `Rs.${i.total}`]),
            headStyles: { fillColor: [46, 125, 50] },
            theme: 'striped'
        });

        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(46, 125, 50);
        doc.text(`Grand Total: Rs. ${saleData.finalAmount.toLocaleString()}`, 140, finalY);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for choosing Civora Nursery. Happy Planting!", 105, finalY + 20, { align: "center" });
        
        doc.save(`Civora_Invoice_${saleData.customerName}.pdf`);
    };

    const handleSale = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Billing cart is currently empty!");
        if (!customer.name || !customer.mobile) return alert("Please enter customer details.");

        const totalAmt = cart.reduce((acc, curr) => acc + curr.total, 0);
        const saleData = {
            customerName: customer.name,
            customerMobile: customer.mobile,
            items: cart,
            subTotal: totalAmt,
            finalAmount: totalAmt,
        };

        try {
            await axios.post('/api/sales/create', saleData);
            alert("Transaction Successful! Generating official invoice...");
            generateInvoice(saleData); 
            setCart([]);
            setCustomer({ name: '', mobile: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Transaction failed. Please try again.");
        }
    };

    return (
        <div className="procurement-container">
            <h2 className="text-green">🛒 Point of Sale (POS) Billing</h2>
            
            

            <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="report-card">
                    <h3>Customer & Item Selection</h3>
                    <input className="proc-input" placeholder="Customer Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} style={{width: '95%', marginBottom: '10px'}} />
                    <input className="proc-input" placeholder="Contact Number" value={customer.mobile} onChange={e => setCustomer({...customer, mobile: e.target.value})} style={{width: '95%', marginBottom: '20px'}} />
                    <hr />
                    <h4 style={{marginTop: '15px'}}>Select Products</h4>
                    <select className="proc-input" value={selectedSeed} onChange={(e) => setSelectedSeed(e.target.value)} style={{width: '100%', marginBottom: '10px'}}>
                        <option value="">-- Choose Stock Item --</option>
                        {seeds.map(s => (
                            <option key={s._id} value={s._id}>
                                {s.name} (Stock: {s.quantity} | ₹{s.price})
                            </option>
                        ))}
                    </select>
                    
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <input className="proc-input" type="number" value={sellQty} onChange={(e) => setSellQty(e.target.value)} min="1" style={{width: '30%'}} />
                        <button onClick={addToCart} className="proc-btn" style={{flex: 1}}>Add to Cart</button>
                    </div>
                </div>

                <div className="report-card">
                    <h3>Billing Summary</h3>
                    <table className="proc-table" style={{width: '100%'}}>
                        <thead>
                            <tr style={{textAlign: 'left', borderBottom: '1px solid #ccc'}}>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.length > 0 ? cart.map((item, index) => (
                                <tr key={index} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '8px 0'}}>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.total}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#888'}}>No items added yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                    <hr style={{margin: '20px 0'}} />
                    <div style={{textAlign: 'right', marginBottom: '20px'}}>
                        <span style={{fontSize: '14px', color: '#666'}}>Total Payable:</span>
                        <h2 style={{color: '#2e7d32', margin: 0}}>₹ {cart.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</h2>
                    </div>
                    <button onClick={handleSale} className="login-button" style={{width: '100%', background: '#2e7d32', padding: '12px'}}>
                        Confirm & Generate PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sales;