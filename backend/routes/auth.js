const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order'); 

// --- NEW: GET ALL USERS (Fixes 404 /api/auth/users) ---
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Password ko chupa kar sabhi users bhejega
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Users load nahi ho paye" });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user && user.password === password) {
            res.json({ 
                token: "fake-jwt-token", 
                role: user.role, 
                id: user._id,  
                name: user.name 
            });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// --- REGISTER ---
router.post('/register', async (req, res) => {
    const { name, email, mobile, password, address, pincode } = req.body;
    try {
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) return res.status(400).json({ message: "Email already registered! ⚠️" });

        const newUser = new User({
            name, email: email.toLowerCase().trim(), password, mobile, address, pincode, role: 'customer'
        });

        await newUser.save();
        res.status(201).json({ message: "Account created successfully! 🎉" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed: " + err.message });
    }
});

// --- CHECK USER EXISTS ---
router.post('/check-user', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
        if (user) return res.json({ exists: true });
        res.status(404).json({ exists: false, message: "User not found!" });
    } catch (err) {
        res.status(500).json({ message: "Error checking user" });
    }
});

// --- RESET PASSWORD ---
router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        await User.findOneAndUpdate({ email: email.toLowerCase().trim() }, { password: newPassword });
        res.json({ message: "Password updated successfully! ✅" });
    } catch (err) {
        res.status(500).json({ message: "Failed to reset password" });
    }
});

module.exports = router;