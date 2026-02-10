const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'staff', 'customer'], 
    default: 'customer' 
  }, 
  mobile: { 
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }, 
  pincode: { 
    type: String,
    trim: true
  }, 
  address: { 
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);