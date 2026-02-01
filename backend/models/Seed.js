const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true }, 
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Seed', seedSchema);