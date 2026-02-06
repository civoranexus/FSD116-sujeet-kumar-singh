const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    supplierName: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    category: { type: String, enum: ['Seed', 'Plant', 'Fertilizer', 'Tool'], default: 'Seed' }
});

module.exports = mongoose.model('Procurement', procurementSchema);