const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nurseryDB';

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected..."))
    .catch(err => console.log("❌ DB Connection Error:", err));

// Routes
const inventoryRoutes = require('./routes/inventory');
app.use('/api/inventory', inventoryRoutes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));