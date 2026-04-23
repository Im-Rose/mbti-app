const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MBTIResult = require('../models/MBTIResult');

router.get('/my-suggestions', auth, async (req, res) => {
    try {
        const mbtiResult = await MBTIResult.findOne({ userId: req.user.userId }).sort({ takenAt: -1 });
        
        let suggestions = [];
        
        if (mbtiResult) {
            const personalizedSuggestions = {
                'INFJ': [
                    { title: '🧘 Practice Self-Care', description: 'As an Advocate, you give so much to others. Remember to recharge your own batteries daily.' },
                    { title: '📝 Journal Your Ideas', description: 'Your intuition is powerful. Write down your insights and visions for the future.' }
                ],
                'INTJ': [
                    { title: '🎯 Set Strategic Goals', description: 'Use your strategic mind to set SMART goals and track your progress.' },
                    { title: '📊 Analyze Your Patterns', description: 'Track your mood data to find patterns and optimize your routines.' }
                ],
                'ENFP': [
                    { title: '🤝 Connect Daily', description: 'Social connections energize you. Make time to talk with friends each day.' },
                    { title: '✨ Try New Things', description: 'Your curiosity is your superpower. Try one new activity each week.' }
                ],
                'ENTJ': [
                    { title: '👥 Delegate Tasks', description: 'You don\'t have to do everything yourself. Trust others to help you.' },
                    { title: '🎉 Celebrate Wins', description: 'Take time to acknowledge your achievements, big and small.' }
                ]
            };
            
            suggestions = personalizedSuggestions[mbtiResult.type] || [
                { title: '📊 Track Your Progress', description: 'Based on your MBTI type, regular tracking can help you achieve your goals.' },
                { title: '🧠 Understand Yourself Better', description: 'Learn more about your personality type to leverage your strengths.' }
            ];
        } else {
            suggestions = [
                { title: '📝 Take the MBTI Test', description: 'Discover your personality type to get personalized suggestions!' },
                { title: '😊 Track Your Mood Daily', description: 'Regular mood tracking helps identify patterns in your emotional health.' },
                { title: '🧘 Take a 5-Minute Break', description: 'Try breathing exercises: Inhale for 4 seconds, hold for 4, exhale for 4.' },
                { title: '🎯 Set One Small Goal', description: 'Small consistent actions lead to big changes over time.' },
                { title: '📖 Journal Your Thoughts', description: 'Writing down 3 things you\'re grateful for can boost your mood.' }
            ];
        }
        
        res.json(suggestions);
    } catch (err) {
        console.error('Get suggestions error:', err);
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
