const router = require('express').Router();
const Sale = require('../models/Sale');
const Seed = require('../models/Seed');

// --- 1. POST: CREATE NEW SALE & UPDATE STOCK ---
router.post('/create', async (req, res) => {
    const { customerName, customerMobile, items, subTotal, tax, discount, finalAmount, paymentMode } = req.body;

    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in the cart" });
        }

        // Stock checking and deduction loop
        for (let item of items) {
            const seed = await Seed.findById(item.seedId);
            if (!seed) {
                return res.status(404).json({ message: `Item ${item.name} not found in inventory` });
            }
            if (seed.quantity < item.quantity) { // Check field name 'quantity' or 'stock' based on your model
                return res.status(400).json({ message: `Insufficient stock for ${seed.name}. Available: ${seed.quantity}` });
            }
            
            seed.quantity -= Number(item.quantity);
            await seed.save();
        }

        const count = await Sale.countDocuments();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${count + 1001}`;

        const newSale = new Sale({
            invoiceNumber,
            customerName,
            customerMobile,
            items,
            subTotal,
            tax,
            discount,
            finalAmount,
            paymentMode,
            saleDate: new Date() // Explicitly setting current date
        });

        await newSale.save();
        res.status(201).json({ 
            message: "Sale successful and stock updated! 🧾", 
            sale: newSale 
        });

    } catch (err) {
        res.status(500).json({ message: "Sale failed: " + err.message });
    }
});

// --- 2. GET: ALL SALES HISTORY ---
router.get('/history', async (req, res) => {
    try {
        const history = await Sale.find().sort({ saleDate: -1 }).limit(50);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: "Error fetching history" });
    }
});

// --- 3. GET: SALES STATS (For Total Revenue) ---
router.get('/stats', async (req, res) => {
    try {
        const stats = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$finalAmount" },
                    totalSales: { $sum: 1 },
                    avgOrderValue: { $avg: "$finalAmount" }
                }
            }
        ]);
        res.json(stats[0] || { totalRevenue: 0, totalSales: 0 });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// --- 4. GET: DAILY SALES FOR ADMIN (Today's List) ---
router.get('/daily-sales', async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));

        const todaySales = await Sale.find({
            saleDate: { $gte: startOfToday, $lte: endOfToday }
        }).sort({ saleDate: -1 });

        const totalTodayRevenue = todaySales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);

        res.json({
            count: todaySales.length,
            revenue: totalTodayRevenue,
            sales: todaySales
        });
    } catch (err) {
        console.error("Daily Sales Error:", err);
        res.status(500).json({ message: "Daily sales fetch failed" });
    }
});

module.exports = router;