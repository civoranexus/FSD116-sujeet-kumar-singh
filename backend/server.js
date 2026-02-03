const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
    });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));

app.listen(5000, () => console.log(`🚀 Server running on port 5000`));