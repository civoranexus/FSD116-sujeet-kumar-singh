const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchNumber: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    seedId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seed',
        required: true 
    },
    plantingDate: { 
        type: Date, 
        default: Date.now 
    },
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
        actionTaken: String 
    }],
    isReady: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true }); 
module.exports = mongoose.model('Batch', batchSchema);