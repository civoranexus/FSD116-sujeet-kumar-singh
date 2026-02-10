const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceNumber: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `CIV-INV-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
    },
    customerName: { 
        type: String, 
        required: true,
        trim: true 
    },
    customerMobile: { 
        type: String,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); 
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    items: [{
        seedId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Seed',
            required: true 
        },
        name: String,
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    subTotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMode: { 
        type: String, 
        enum: ['Cash', 'Online', 'UPI', 'Card'], 
        default: 'Cash' 
    },
    saleDate: { type: Date, default: Date.now }
}, { timestamps: true });

saleSchema.pre('validate', function(next) {
    if (this.items && this.items.length > 0) {
        this.subTotal = this.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        this.finalAmount = (this.subTotal + this.tax) - this.discount;
    }
    next();
});

module.exports = mongoose.model('Sale', saleSchema);