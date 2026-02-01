const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Path sahi hona chahiye

// Register Route
router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User Created!" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;