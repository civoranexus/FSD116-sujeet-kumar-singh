const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aapka-email@gmail.com', 
    pass: 'xxxx xxxx xxxx xxxx'   
  }
});

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    const mailOptions = {
        from: '"Nursery Portal" <sujeet.example@gmail.com>',
        to: email,
        subject: 'Email Verification OTP',
        text: `Nursery Portal registration ke liye aapka OTP hai: ${otp}. Ye 5 minute ke liye valid hai.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP Sent to:", email); 
        res.status(200).json({ message: "OTP send!" });
    } catch (error) {
        console.error("Nodemailer Error:", error); 
        res.status(500).json({ message: "Email not send", error: error.message });
    }
});

// 2. Route: Verify & Register
router.post('/register', async (req, res) => {
    const { name, email, mobile, password, otp } = req.body;

    if (otpStore[email] === otp) {
        try {
            const newUser = new User({ name, email, mobile, password });
            await newUser.save();
            delete otpStore[email]; 
            res.status(201).json({ message: "Account Created Successfully!" });
        } catch (err) {
            res.status(400).json({ message: "Database error ya User pehle se hai." });
        }
    } else {
        res.status(400).json({ message: "Galat OTP! Kripya sahi code dalein." });
    }
});

module.exports = router;