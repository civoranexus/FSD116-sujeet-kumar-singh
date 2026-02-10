const router = require('express').Router();
const Batch = require('../models/Batch');

router.put('/update-health/:id', async (req, res) => {
    try {
        const { currentStage, healthStatus, observation, height, actionTaken } = req.body;

        const batch = await Batch.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({ message: "Batch record not found! ⚠️" });
        }

        if (currentStage) batch.currentStage = currentStage;
        if (healthStatus) batch.healthStatus = healthStatus;

        const newLog = {
            observation: observation || "Routine inspection",
            height: height || "N/A",
            actionTaken: actionTaken || "None",
            updateDate: Date.now()
        };

        batch.growthLogs.push(newLog);

        if (currentStage === 'Ready for Sale') {
            batch.isReady = true;
        }

        await batch.save();
        res.json({ 
            message: "Batch Life-Cycle record updated successfully! 🌱", 
            currentStage: batch.currentStage,
            isReady: batch.isReady 
        });
    } catch (err) {
        console.error("Batch Update Error:", err);
        res.status(500).json({ message: "Lifecycle update failed: " + err.message });
    }
});

router.get('/tracking-list', async (req, res) => {
    try {
        const batches = await Batch.find()
            .populate('seedId', 'name category')
            .sort({ updatedAt: -1 }); 
            
        res.json(batches);
    } catch (err) {
        console.error("Fetch Tracking List Error:", err);
        res.status(500).json({ message: "Unable to load tracking data." });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id).populate('seedId');
        if (!batch) {
            return res.status(404).json({ message: "Specific batch details not found." });
        }
        res.json(batch);
    } catch (err) {
        console.error("Fetch Single Batch Error:", err);
        res.status(500).json({ message: "Error retrieving batch details." });
    }
});

module.exports = router;