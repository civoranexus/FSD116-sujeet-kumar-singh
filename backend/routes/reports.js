const router = require('express').Router();
const Sale = require('../models/Sale');
const Seed = require('../models/Seed');

router.get('/inventory-valuation', async (req, res) => {
    try {
        const seeds = await Seed.find();
        
        const totalValuation = seeds.reduce((sum, seed) => sum + (seed.quantity * seed.price), 0);
        
        const categoryWise = await Seed.aggregate([
            { 
                $group: { 
                    _id: "$category", 
                    totalValue: { $sum: { $multiply: ["$price", "$quantity"] } }, 
                    stock: { $sum: "$quantity" } 
                } 
            },
            { $sort: { totalValue: -1 } } 
        ]);

        res.json({ 
            totalValuation, 
            categoryWise,
            message: "Inventory valuation calculated successfully" 
        });
    } catch (err) {
        console.error("Valuation Error:", err);
        res.status(500).json({ message: "Failed to calculate inventory valuation" });
    }
});

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

        res.json({
            analytics: monthlyData,
            message: "Monthly sales analytics retrieved successfully"
        });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ message: "Failed to retrieve sales analytics" });
    }
});

module.exports = router;