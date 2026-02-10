const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
    itemName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity cannot be less than 1'] },
    unitPrice: { type: Number, required: true, min: [0, 'Unit price cannot be negative'] },
    totalCost: { type: Number, default: 0 }, 
    supplierName: { type: String, required: true, trim: true },
    purchaseDate: { type: Date, default: Date.now },
    category: { 
        type: String, 
        enum: ['Seed', 'Plant', 'Fertilizer', 'Tool', 'Pesticide'], 
        default: 'Seed' 
    },
    status: {
        type: String,
        enum: ['Ordered', 'Received', 'Cancelled'],
        default: 'Received'
    }
}, { timestamps: true });

procurementSchema.pre('save', async function() {
    if (this.quantity && this.unitPrice) {
        this.totalCost = this.quantity * this.unitPrice;
    }
});

module.exports = mongoose.model('Procurement', procurementSchema);