const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    category: { 
    type: String, 
    required: true,
    enum: [
        'Flowering', 'Flowers', 'Vegetables', 'Vegetable', 'Fruits', 'Fruit', 
        'Herbs', 'Ornamental', 'Medicinal', 'Cereal Crop', 'Oilseed Crop', 
        'Seed', 'Plant', 'Fertilizer', 'Tool'
    ], 
    default: 'Vegetables'
},
    quantity: { 
        type: Number, 
        required: true,
        min: [0, 'Quantity cannot be negative']
    },
    price: { 
        type: Number, 
        required: true,
        min: [0, 'Price cannot be negative']
    },
    lowStockThreshold: { 
        type: Number, 
        default: 10 
    },
    description: {
        type: String,
        trim: true
    },
    image: { 
        type: String, 
        default: "https://via.placeholder.com/150" 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Seed', seedSchema);