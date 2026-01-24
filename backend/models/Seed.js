const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Flower', 'Vegetable', 'Fruit', 'Tree'], default: 'Flower' },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  supplier: { type: String },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seed', seedSchema);