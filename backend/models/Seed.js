const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "https://via.placeholder.com/150" }, // डिफ़ॉल्ट इमेज
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seed', seedSchema);