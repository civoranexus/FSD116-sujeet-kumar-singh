const router = require('express').Router();
const Sale = require('../models/Sale');
const Seed = require('../models/Seed');

router.post('/create', async (req, res) => {
    const { customerName, customerMobile, items, subTotal, tax, discount, finalAmount, paymentMode } = req.body;

    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Please add items." });
        }

        for (let item of items) {
            const seed = await Seed.findById(item.seedId);
            if (!seed) {
                return res.status(404).json({ message: `Product ${item.name} not found in inventory.` });
            }
            if (seed.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${seed.name}. Available: ${seed.quantity}` 
                });
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
            finalAmount: Number(finalAmount), 
            paymentMode,
            saleDate: new Date() 
        });

        await newSale.save();
        res.status(201).json({ 
            message: "Sale processed successfully! 🧾", 
            sale: newSale 
        });

    } catch (err) {
        console.error("Sale Processing Error:", err);
        res.status(500).json({ message: "Transaction failed: " + err.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const history = await Sale.find().sort({ saleDate: -1 }).limit(50);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch sales history." });
    }
});

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
        res.json(stats[0] || { totalRevenue: 0, totalSales: 0, avgOrderValue: 0 });
    } catch (err) {
        res.status(500).json({ message: "Failed to calculate sales statistics." });
    }
});

router.get('/daily-sales', async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));

        const todaySales = await Sale.find({
            saleDate: { $gte: startOfToday, $lte: endOfToday }
        }).sort({ saleDate: -1 });

        const totalTodayRevenue = todaySales.reduce((sum, sale) => sum + (Number(sale.finalAmount) || 0), 0);

        res.json({
            count: todaySales.length,
            revenue: totalTodayRevenue,
            sales: todaySales
        });
    } catch (err) {
        res.status(500).json({ message: "Daily sales record retrieval failed." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) return res.status(404).json({ message: "Sale record not found" });
        res.json({ message: "Transaction record deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Delete operation failed." });
    }
});

module.exports = router;