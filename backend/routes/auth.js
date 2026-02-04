const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

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
});

router.post('/add-staff', async (req, res) => {
    const { name, email, password, mobile } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email allready registererd!" });

        const newStaff = new User({
            name,
            email: email.toLowerCase().trim(),
            password,
            mobile,
            role: 'staff'
        });

        await newStaff.save();
        res.status(201).json({ message: "Successfully Add ✅" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Internal server error!" });
    }
});

router.delete('/delete-staff/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userToDelete = await User.findById(userId);
        
        if (!userToDelete) return res.status(404).json({ message: "User not found!" });
        
        if (userToDelete.role === 'admin') {
            return res.status(400).json({ message: "Admin!" });
        }

        await User.findByIdAndDelete(userId);
        res.json({ message: "Staff remove  successfully! 🗑️" });
    } catch (err) {
        res.status(500).json({ message: "Error!" });
    }
});

router.get('/user-profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        const Order = require('../models/Order');
        const orderCount = await Order.countDocuments({ customer: req.params.id });
        
        res.json({
            user,
            orderCount
        });
    } catch (err) {
        res.status(500).json({ message: "Profile load nahi ho payi" });
    }
});

module.exports = router;