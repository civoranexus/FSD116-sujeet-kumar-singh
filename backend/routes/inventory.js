const express = require('express');
const router = express.Router();
const Seed = require('../models/Seed');
const Order = require('../models/Order');
const User = require('../models/User');
const Sale = require('../models/Sale');

router.get('/admin-stats', async (req, res) => {
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const [orders, seeds, sales] = await Promise.all([
            Order.find().populate('customer', 'name'), 
            Seed.find(),
            Sale.find()
        ]);

        const todayOrders = orders.filter(o => {
            const d = new Date(o.orderDate || o.createdAt);
            return d >= start && d <= end;
        });

        const todaySalesEntries = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= start && d <= end;
        });

        const deliveredOrderRevenue = orders
            .filter(o => o.status === 'Delivered')
            .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

        const totalSaleRevenue = sales.reduce((sum, s) => sum + (Number(s.finalAmount) || 0), 0);

        const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0) + 
                             todaySalesEntries.reduce((sum, s) => sum + (Number(s.finalAmount) || 0), 0);

        res.json({
            totalRevenue: deliveredOrderRevenue + totalSaleRevenue, 
            totalOrders: orders.length + sales.length,
            pendingOrders: orders.filter(o => o.status === 'Pending').length,
            lowStockCount: seeds.filter(s => s.quantity < 5).length,
            dailySales: {
                count: todayOrders.length + todaySalesEntries.length,
                revenue: todayRevenue,
                sales: [...todayOrders.map(o => ({
                    _id: o._id,
                    customerName: o.customerName || o.customer?.name || "Customer", 
                    finalAmount: o.totalPrice,
                    saleDate: o.orderDate || o.createdAt
                })), ...todaySalesEntries]
            }
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: "Analytics failed to load." });
    }
});

router.get('/all', async (req, res) => {
    try {
        const seeds = await Seed.find().sort({ createdAt: -1 });
        res.json(seeds);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch inventory." });
    }
});

router.post('/place-order', async (req, res) => {
    const { customerId, seedId, quantity, totalPrice } = req.body;
    try {
        const user = await User.findById(customerId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const seed = await Seed.findById(seedId);
        if (!seed || seed.quantity < quantity) {
            return res.status(400).json({ message: "Stock Alert: Insufficient inventory quantity." });
        }
        
        const newOrder = new Order({
            customer: customerId,
            customerName: user.name || "New Customer", 
            seed: seedId,
            quantity: Number(quantity),
            totalPrice: Number(totalPrice),
            address: `${user.address || 'Address not provided'}, Mobile: ${user.mobile || 'N/A'}` 
        });

        await newOrder.save();

        seed.quantity -= Number(quantity);
        await seed.save();

        res.status(201).json({ message: "Order processed successfully! 📦" });
    } catch (err) { 
        console.error("Order Placement Error:", err);
        res.status(500).json({ message: "Transaction Error: " + err.message }); 
    }
});

router.put('/update-customer-name/:orderId', async (req, res) => {
    try {
        const { newName } = req.body;
        await Order.findByIdAndUpdate(req.params.orderId, { $set: { customerName: newName } });
        res.json({ message: "Customer name updated for this order!" });
    } catch (err) {
        res.status(500).json({ message: "Update failed." });
    }
});

router.put('/update-status/:orderId', async (req, res) => {
    try { 
        await Order.findByIdAndUpdate(req.params.orderId, { $set: { status: req.body.status } }); 
        res.json({ message: `Status updated to ${req.body.status}!` }); 
    } catch (err) { res.status(500).json({ message: "Status update failed." }); }
});

router.put('/update-address/:orderId', async (req, res) => {
    try { await Order.findByIdAndUpdate(req.params.orderId, { $set: { address: req.body.newAddress } }); res.json({ message: "Address updated!" }); } catch (err) { res.status(500).json({ message: "Error" }); }
});

router.get('/my-orders/:userId', async (req, res) => {
    try { const orders = await Order.find({ customer: req.params.userId }).populate('seed', 'name price image').sort({ orderDate: -1 }); res.json(orders); } catch (err) { res.status(500).json({ message: "Error" }); }
});

router.get('/all-orders', async (req, res) => {
    try { const orders = await Order.find().populate('seed', 'name price category').populate('customer', 'name email mobile').sort({ orderDate: -1 }); res.json(orders); } catch (err) { res.status(500).json({ message: "Error" }); }
});

router.post('/add', async (req, res) => {
    const { name, category, quantity, price, image, description } = req.body;
    try {
        const newSeed = new Seed({ name, category, quantity: Number(quantity), price: Number(price), image, description });
        await newSeed.save();
        res.status(201).json({ message: "Item added! 🌱" });
    } catch (err) { res.status(500).json({ message: "Add failed." }); }
});

module.exports = router;