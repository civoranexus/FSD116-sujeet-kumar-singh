const router = require('express').Router();
const Sale = require('../models/Sale');
const Seed = require('../models/Seed');

// --- 1. GET: INVENTORY VALUATION ---
router.get('/inventory-valuation', async (req, res) => {
    try {
        const seeds = await Seed.find();
        const totalValuation = seeds.reduce((sum, seed) => sum + (seed.quantity * seed.price), 0);
        
        const categoryWise = await Seed.aggregate([
            { $group: { _id: "$category", totalValue: { $sum: { $multiply: ["$price", "$quantity"] } }, stock: { $sum: "$quantity" } } }
        ]);

        res.json({ totalValuation, categoryWise });
    } catch (err) {
        res.status(500).json({ message: "Valuation error" });
    }
});

// --- 2. GET: SALES ANALYTICS (Monthly) ---
router.get('/sales-analytics', async (req, res) => {
    try {
        const monthlyData = await Sale.aggregate([
            {
                $group: {
                    _id: { $month: "$saleDate" },
                    monthlyRevenue: { $sum: "$finalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        res.json(monthlyData);
    } catch (err) {
        res.status(500).json({ message: "Analytics error" });
    }
});

module.exports = router;