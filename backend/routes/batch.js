const router = require('express').Router();
const Batch = require('../models/Batch');

// 1. Update Health and Growth Log
router.put('/update-health/:id', async (req, res) => {
    try {
        const { currentStage, healthStatus, observation, height, actionTaken } = req.body;
        const batch = await Batch.findById(req.params.id);

        if (!batch) return res.status(404).json({ message: "Batch not found" });

        batch.currentStage = currentStage;
        batch.healthStatus = healthStatus;
        
        // Log add karein
        batch.growthLogs.push({ observation, height, actionTaken });
        
        if (currentStage === 'Ready for Sale') batch.isReady = true;

        await batch.save();
        res.json({ message: "Batch Life-Cycle Updated! 🌱", batch });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Get all batches for tracking
router.get('/tracking-list', async (req, res) => {
    try {
        const batches = await Batch.find().populate('seedId', 'name');
        res.json(batches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;