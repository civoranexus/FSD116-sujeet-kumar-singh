const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, 
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seed', seedSchema);