const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect('mongodb://localhost:27017/nurseryDB')
    .then(async () => {
        console.log("✅ MongoDB Connected...");
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            await User.insertMany([
                { name: "Admin Sujeet", email: "admin@test.com", password: "admin123", role: "admin" },
                { name: "Staff Member", email: "staff@test.com", password: "staff123", role: "staff" },
                { name: "Customer Sujeet", email: "customer@test.com", password: "customer123", role: "customer" }
            ]);
            console.log("⭐ Default Users Created!");
        }
    })
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- ROUTES REGISTRATION ---
// In sabhi files ka 'routes' folder mein hona zaroori hai
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/procurement', require('./routes/procurement')); 
app.use('/api/batches', require('./routes/batch'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/sales', require('./routes/sales'));

// --- 404 CATCH-ALL ROUTE ---
app.use((req, res) => {
    console.log(`⚠️ 404 Attempted on: ${req.url}`);
    res.status(404).json({ message: "Backend Route Not Found - Check server.js" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));