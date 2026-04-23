const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');

// Add a mood entry
router.post('/add', auth, async (req, res) => {
    try {
        const { mood, comment } = req.body;
        
        if (!mood) {
            return res.status(400).json({ msg: 'Mood is required' });
        }
        
        const entry = new MoodEntry({
            userId: req.user.userId,
            mood,
            comment: comment || ''
        });
        
        await entry.save();
        console.log(`✅ Mood saved: ${mood} for user ${req.user.userId}`);
        res.json({ msg: 'Mood saved successfully!', entry });
        
    } catch (err) {
        console.error('Save mood error:', err);
        res.status(500).json({ msg: err.message });
    }
});

// Get user's moods (last 30 entries)
router.get('/my-moods', auth, async (req, res) => {
    try {
        const moods = await MoodEntry.find({ userId: req.user.userId }).sort({ date: -1 }).limit(30);
        res.json(moods);
    } catch (err) {
        console.error('Get moods error:', err);
        res.status(500).json({ msg: err.message });
    }
});

// Get user's moods (last 30 days)
router.get('/last-30-days', auth, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const moods = await MoodEntry.find({
            userId: req.user.userId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: 1 });
        
        res.json(moods);
    } catch (err) {
        console.error('Get last 30 days moods error:', err);
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
