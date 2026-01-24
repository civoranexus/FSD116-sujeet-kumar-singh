const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const MONGO_URI = "mongodb://localhost:27017/nurseryDB"; 
mongoose.connect(MONGO_URI)
    .then(() => console.log("Database connected successfully!"))
    .catch(err => console.log("DB Connection Error:", err));


const seedSchema = new mongoose.Schema({
    name: String,
    Item: String,
    category: String,
    stockQuantity: Number,
    price: Number
});
const Seed = mongoose.model('Seed', seedSchema);


app.get('/api/seeds', async (req, res) => {
    const seeds = await Seed.find();
    res.json(seeds);
});

app.post('/api/seeds', async (req, res) => {
    const newSeed = new Seed(req.body);
    await newSeed.save();
    res.json({ message: "Seed added!" });
});

// Server Start
app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});