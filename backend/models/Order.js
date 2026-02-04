const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seed: { type: mongoose.Schema.Types.ObjectId, ref: 'Seed', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, 
    orderDate: { type: Date, default: Date.now },
    address: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);