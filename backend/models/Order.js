const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    customerName: {
        type: String,
        trim: true,
        default: 'Valued Customer'
    },
    seed: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seed', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true,
        min: [1, 'Quantity cannot be less than 1'] 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Shipped', 'Delivered', 'Cancelled'] 
    }, 
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    address: { 
        type: String, 
        required: true,
        trim: true 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema);