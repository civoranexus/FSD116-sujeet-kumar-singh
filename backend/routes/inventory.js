const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Seed = require('../models/Seed');

// Get all items (for Dashboard)
router.get('/', async (req, res) => {
    try {
        const seeds = await Seed.find();
        res.json(seeds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new item (for Inventory form)
router.post('/add', async (req, res) => {
    try {
        console.log("Backend Received:", req.body); 
        
        const newSeed = new Seed(req.body);
        const savedSeed = await newSeed.save();
        res.status(201).json(savedSeed);
    } catch (err) {
        res.status(400).json({ message: err.message }); 
    }
});

// 3. Seed deleted
router.delete('/:id', async (req, res) => {
    try {
        await Seed.findByIdAndDelete(req.params.id);
        res.json({ message: "Seed delete ho gaya!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Stock Sell  (PUT)
router.put('/sell/:id', async (req, res) => {
    try {
        const { sellQuantity } = req.body;
        const seed = await Seed.findById(req.params.id);

        if (seed.quantity < sellQuantity) {
            return res.status(400).json({ message: "Stock kam hai!" });
        }

        seed.quantity -= sellQuantity; 
        await seed.save();
        res.json({ message: "Bikri safal rahi!", updatedStock: seed.quantity });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const seedSchema = new mongoose.Schema({
    name: String,
    category: String,
    quantity: Number, // Sab small letters mein
    price: Number
});

module.exports = router;