const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // User model se link
        required: true 
    },
    orderItems: [
        {
            seed: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Seed', // Seed model se link
                required: true 
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Paid', 'Unpaid'], 
        default: 'Unpaid' 
    },
    address: { type: String, required: true },
    orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);