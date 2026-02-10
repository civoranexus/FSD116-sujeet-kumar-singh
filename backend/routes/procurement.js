const router = require('express').Router();
const Procurement = require('../models/Procurement');
const Seed = require('../models/Seed'); 

router.post('/add', async (req, res) => {
    const { itemName, quantity, unitPrice, supplierName, category } = req.body;
    try {
        const totalCost = quantity * unitPrice;
        
        const newEntry = new Procurement({
            itemName, 
            quantity, 
            unitPrice, 
            totalCost, 
            supplierName, 
            category,
            status: 'Received' 
        });

        await newEntry.save();

        const item = await Seed.findOne({ name: itemName });
        if (item) {
            item.quantity += Number(quantity); 
            await item.save();
        }

        res.status(201).json({ 
            message: "Procurement record created and Inventory stock updated successfully! ✅",
            data: newEntry 
        });
    } catch (err) {
        console.error("Procurement Error:", err);
        res.status(500).json({ message: "System failed to process procurement: " + err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const records = await Procurement.find().sort({ purchaseDate: -1 });
        res.json(records);
    } catch (err) {
        console.error("Fetch Procurement Error:", err);
        res.status(500).json({ message: "Unable to retrieve procurement data records." });
    }
});

module.exports = router;