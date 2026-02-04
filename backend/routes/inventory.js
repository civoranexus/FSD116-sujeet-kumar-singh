const express = require('express');
const router = express.Router();
const Seed = require('../models/Seed');
const Order = require('../models/Order');

// 1. Get all seeds
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
    console.log("Add Seed Request Received:", req.body);
    try {
        const { name, category, quantity, price } = req.body;
        
        const newSeed = new Seed({
            name,
            category,
            quantity: Number(quantity),
            price: Number(price)
        });

        await newSeed.save();
        console.log("✅ Seed Saved Successfully!");
        res.status(201).json(newSeed);
    } catch (err) {
        console.error("❌ Save Error:", err.message);
        res.status(400).json({ message: "Galti: " + err.message });
    }
});
router.post('/place-order', async (req, res) => {
   
    const { customerId, seedId, quantity, totalPrice, address } = req.body;

    try {
        const seed = await Seed.findById(seedId);
        if (!seed || seed.quantity < quantity) {
            return res.status(400).json({ message: "Stock low!" });
        }

        
        const newOrder = new Order({
            customer: customerId,
            seed: seedId,
            quantity,
            totalPrice,
            address 
        });
        await newOrder.save();

        seed.quantity -= quantity;
        await seed.save();

        res.status(201).json({ message: "Order Successfully! 📦" });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Server Error: Order not save! " });
    }
});


router.put('/update-address/:orderId', async (req, res) => {
    const { newAddress } = req.body;
    try {
        await Order.findByIdAndUpdate(req.params.orderId, { address: newAddress });
        res.json({ message: "Updated" });
    } catch (err) {
        res.status(500).send(err);
    }
});


router.get('/my-orders/:customerId', async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.params.customerId })
                                  .populate('seed') 
                                  .sort({ orderDate: -1 }); 
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Orders not loaded!" });
    }
});

module.exports = router;