const router = require('express').Router();
const Procurement = require('../models/Procurement');
const Seed = require('../models/Seed'); 

// --- 1. ADD NEW PROCUREMENT ---
router.post('/add', async (req, res) => {
    const { itemName, quantity, unitPrice, supplierName, category } = req.body;
    try {
        const totalCost = quantity * unitPrice;
        const newEntry = new Procurement({
            itemName, quantity, unitPrice, totalCost, supplierName, category
        });

        await newEntry.save();

        // Seed/Inventory update logic
        const item = await Seed.findOne({ name: itemName });
        if (item) {
            item.stock += Number(quantity);
            await item.save();
        }

        res.status(201).json({ message: "Procurement added and Stock updated! ✅" });
    } catch (err) {
        res.status(500).json({ message: "Error adding procurement: " + err.message });
    }
});

// --- 2. GET ALL RECORDS ---
router.get('/all', async (req, res) => {
    try {
        const records = await Procurement.find().sort({ purchaseDate: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: "Error fetching data" });
    }
});


module.exports = router;