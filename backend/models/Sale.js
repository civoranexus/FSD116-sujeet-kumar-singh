const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceNumber: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `INV-${Date.now()}` // Automatic Unique Invoice Number
    },
    customerName: { type: String, required: true },
    customerMobile: { type: String },
    items: [{
        seedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seed' },
        name: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    subTotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMode: { 
        type: String, 
        enum: ['Cash', 'Online', 'UPI'], 
        default: 'Cash' 
    },
    saleDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);