const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// বর্তমান ইউজারের তথ্য পাওয়া (Get current user)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'ইউজার খুঁজে পাওয়া যায়নি' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ msg: 'সার্ভার এরর' });
    }
});

// নতুন ইউজার রেজিস্ট্রেশন (Register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'এই ইমেইল দিয়ে অলরেডি অ্যাকাউন্ট আছে' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, name, email } });
        
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// লগইন (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'ভুল ইমেইল বা পাসওয়ার্ড' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'ভুল ইমেইল বা পাসওয়ার্ড' });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, name: user.name, email } });
        
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
