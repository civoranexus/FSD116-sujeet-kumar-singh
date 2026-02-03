const express = require('express');
const router = express.Router();
const Seed = require('../models/Seed');

// 1. Get all seeds
router.get('/', async (req, res) => {
    try {
        const seeds = await Seed.find();
        res.json(seeds);
    } catch (err) {
        res.status(500).json({ message: "Data load nahi ho paya" });
    }
});

// 2. Add new seed
router.post('/add', async (req, res) => {
    console.log("Add Seed Request Received:", req.body); // Terminal mein check karein
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

module.exports = router;