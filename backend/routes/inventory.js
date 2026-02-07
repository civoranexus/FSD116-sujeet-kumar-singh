const express = require('express');
const router = express.Router();
const Seed = require('../models/Seed');
const Order = require('../models/Order');
const User = require('../models/User'); 

// --- ADMIN STATS ---
router.get('/admin-stats', async (req, res) => {
    try {
        const userRole = req.headers['role'];
        if (userRole !== 'admin' && userRole !== 'staff') {
            return res.status(403).json({ message: "You are not authorized to access this page!" });
        }

        const orders = await Order.find();
        const seeds = await Seed.find();

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;

        const lowStockItems = seeds.filter(s => s.quantity < 5).map(s => ({
            name: s.name,
            quantity: s.quantity
        }));

        res.json({
            totalRevenue,
            totalOrders: orders.length,
            pendingOrders,
            lowStockCount: lowStockItems.length,
            lowStockItems 
        });
    } catch (err) {
        res.status(500).json({ message: "Error loading admin stats" });
    }
});

// --- FIX 404: Get all seeds (Dono routes kaam karenge) ---
router.get('/all', async (req, res) => {
    try {
        const seeds = await Seed.find();
        res.json(seeds);
    } catch (err) {
        res.status(500).json({ message: "Data not load" });
    }
});

router.get('/', async (req, res) => {
    try {
        const seeds = await Seed.find();
        res.json(seeds);
    } catch (err) {
        res.status(500).json({ message: "Data not load" });
    }
});

// 2. Add new seed
router.post('/add', async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;
        const newSeed = new Seed({
            name,
            category,
            quantity: Number(quantity),
            price: Number(price)
        });
        await newSeed.save();
        res.status(201).json(newSeed);
    } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
    }
});

// 3. Place Order 
router.post('/place-order', async (req, res) => {
    const { customerId, seedId, quantity, totalPrice } = req.body;
    try {
        const user = await User.findById(customerId);
        if (!user || !user.address || !user.mobile || !user.pincode) {
            return res.status(400).json({ 
                message: "Please complete your Profile (Mobile, Pincode, Address) first! 👤" 
            });
        }

        const seed = await Seed.findById(seedId);
        if (!seed || seed.quantity < quantity) {
            return res.status(400).json({ message: "Stock low!" });
        }

        const fullAddress = `${user.address}, Pincode: ${user.pincode}, Mobile: ${user.mobile}`;

        const newOrder = new Order({
            customer: customerId,
            seed: seedId,
            quantity,
            totalPrice,
            address: fullAddress 
        });

        await newOrder.save();
        seed.quantity -= quantity;
        await seed.save();

        res.status(201).json({ message: "Order Placed Successfully! 📦" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: Order not save! " });
    }
});

// --- ORDER MANAGEMENT ---
router.get('/all-orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('seed').populate('customer', 'name email').sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "All orders not loaded!" });
    }
});

router.put('/update-status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: status }, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: "Status update failed" });
    }
});

router.put('/update-address/:orderId', async (req, res) => {
    const { newAddress } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, { address: newAddress }, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Order not found!" });
        res.json({ message: "address change! ✅" });
    } catch (err) {
        res.status(500).send({ message: "Update fail: " + err.message });
    }
});

router.get('/my-orders/:customerId', async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.params.customerId }).populate('seed').sort({ orderDate: -1 }); 
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Orders not loaded!" });
    }
});

module.exports = router;