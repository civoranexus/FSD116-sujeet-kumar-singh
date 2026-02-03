const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 1. LOGIN ROUTE (Yeh missing tha, isliye login nahi ho raha tha)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) {
            return res.status(400).json({ message: "User nahi mila!" });
        }

        // Direct password comparison
        if (user.password !== password) {
            return res.status(400).json({ message: "Galat password!" });
        }

        // Token Generation (Secret key wahi rakhein jo server.js mein ho)
        const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET123');
        
        res.json({ 
            token, 
            role: user.role, 
            name: user.name 
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 2. ADD STAFF ROUTE
router.post('/add-staff', async (req, res) => {
    const { name, email, password, mobile } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email pehle se register hai!" });

        const newStaff = new User({
            name,
            email: email.toLowerCase().trim(),
            password,
            mobile,
            role: 'staff'
        });

        await newStaff.save();
        res.status(201).json({ message: "Staff Successfully Add Ho Gaya! ✅" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. GET ALL USERS ROUTE
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Load nahi ho paya" });
    }
});

// 4. DELETE STAFF ROUTE
router.delete('/delete-staff/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userToDelete = await User.findById(userId);
        
        if (!userToDelete) return res.status(404).json({ message: "User nahi mila" });
        
        if (userToDelete.role === 'admin') {
            return res.status(400).json({ message: "Admin ko delete nahi kiya ja sakta!" });
        }

        await User.findByIdAndDelete(userId);
        res.json({ message: "Staff successfully remove ho gaya! 🗑️" });
    } catch (err) {
        res.status(500).json({ message: "Delete karne mein error aayi" });
    }
});

module.exports = router;