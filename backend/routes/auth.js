const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Authentication failed: Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, 'civora_secret_key', { expiresIn: '1d' });
        res.json({ token, role: user.role, id: user._id, name: user.name });
    } catch (err) {
        res.status(500).json({ message: "Server error during authentication process." });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, mobile, password, address, pincode } = req.body;
    try {
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) return res.status(400).json({ message: "Identity conflict: Email already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email: email.toLowerCase().trim(), password: hashedPassword, mobile, address, pincode, role: 'customer' });

        await newUser.save();
        res.status(201).json({ message: "Account registered successfully! 🎉" });
    } catch (err) {
        res.status(500).json({ message: "System error during account creation." });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to load user directory." });
    }
});

router.post('/add-staff', async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) return res.status(400).json({ message: "Conflict: Email already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStaff = new User({ 
            name, 
            email: email.toLowerCase().trim(), 
            password: hashedPassword, 
            mobile, 
            role: 'staff' 
        });

        await newStaff.save();
        res.status(201).json({ message: "Staff member added successfully! 🌱" });
    } catch (err) {
        res.status(500).json({ message: "Error while registering staff member." });
    }
});

router.delete('/delete-staff/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Staff record removed successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error deleting staff member." });
    }
});

router.get('/user-profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ message: "Account settings not found." });

        const orderCount = await Order.countDocuments({ customer: req.params.userId });
        res.json({ user, orderCount });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile information." });
    }
});

router.put('/update-profile/:userId', async (req, res) => {
    const { name, mobile, address, pincode } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: { name, mobile, address, pincode } },
            { new: true, runValidators: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "Update failed: User record not found." });

        res.json({ message: "Profile updated successfully! ✅", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server error while updating profile information." });
    }
});

module.exports = router;