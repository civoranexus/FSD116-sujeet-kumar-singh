const express = require('express');
const router = express.Router();
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
    const newSeed = new Seed({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
    });

    try {
        const savedSeed = await newSeed.save();
        res.status(201).json(savedSeed);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;