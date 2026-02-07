const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchNumber: { type: String, required: true, unique: true },
    seedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seed' },
    plantingDate: { type: Date, default: Date.now },
    currentStage: { 
        type: String, 
        enum: ['Sowing', 'Germination', 'Seedling', 'Vegetative', 'Ready for Sale'],
        default: 'Sowing' 
    },
    healthStatus: { 
        type: String, 
        enum: ['Excellent', 'Good', 'Average', 'Poor', 'Under Treatment'],
        default: 'Good' 
    },
    growthLogs: [{
        updateDate: { type: Date, default: Date.now },
        observation: String,
        height: String,
        actionTaken: String // e.g., "Fertilized", "Pesticide applied"
    }],
    isReady: { type: Boolean, default: false }
});

module.exports = mongoose.model('Batch', batchSchema);