const router = require('express').Router();
const Seed = require('../models/Seed');

router.get('/', async (req, res) => {
  try {
    const seeds = await Seed.find();
    res.json(seeds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', async (req, res) => {
  const newSeed = new Seed(req.body);
  try {
    const savedSeed = await newSeed.save();
    res.status(201).json(savedSeed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;