const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MBTIResult = require('../models/MBTIResult');

const questions = [
    { id: 1, text: "You have a free weekend. What do you prefer to do?", options: ["Go to a party or social event", "Spend time with a small group of close friends", "Stay home and read a book or watch movies", "Go on an adventure or try something new"], trait: "EI" },
    { id: 2, text: "When solving a problem at work, you typically...", options: ["Follow proven methods and facts", "Trust your gut feeling and intuition", "Ask colleagues for their opinions", "Research online for innovative solutions"], trait: "SN" },
    { id: 3, text: "What drives you the most in your career?", options: ["Achieving goals and recognition", "Making a positive impact on others", "Personal growth and learning", "Financial stability and security"], trait: "TF" },
    { id: 4, text: "How do you prefer to organize your daily tasks?", options: ["With a detailed to-do list", "With a flexible schedule", "I don't plan, I go with the flow", "I prioritize based on urgency"], trait: "JP" },
    { id: 5, text: "After an intense social gathering, you feel...", options: ["Energized and excited", "Tired but happy", "Drained and need alone time", "Inspired to do more"], trait: "EI" },
    { id: 6, text: "What type of books or movies do you enjoy most?", options: ["Non-fiction and documentaries", "Fantasy and science fiction", "Romance and drama", "Mystery and thriller"], trait: "SN" },
    { id: 7, text: "When someone shares a personal problem with you, you...", options: ["Offer logical solutions", "Listen and provide emotional support", "Share a similar experience of your own", "Help them find professional advice"], trait: "TF" },
    { id: 8, text: "Your dream vacation would be...", options: ["A fully planned tour package", "A spontaneous road trip", "A relaxing beach resort", "An adventurous mountain trek"], trait: "JP" },
    { id: 9, text: "In a team project, you naturally take the role of...", options: ["The leader who delegates tasks", "The supporter who helps everyone", "The analyst who checks details", "The creative who generates ideas"], trait: "EI" },
    { id: 10, text: "What fascinates you the most?", options: ["Technology and innovation", "Art and creativity", "Science and discovery", "Human behavior and psychology"], trait: "SN" },
    { id: 11, text: "When making an important life decision, you rely on...", options: ["Logic and data analysis", "Your heart and feelings", "Advice from trusted people", "Pros and cons lists"], trait: "TF" },
    { id: 12, text: "Your workspace or study area is usually...", options: ["Very organized and clean", "Creatively messy", "Minimalist and simple", "Full of personal items and photos"], trait: "JP" },
    { id: 13, text: "You prefer conversations that are...", options: ["Light and fun", "Deep and meaningful", "Informative and educational", "Quick and to the point"], trait: "EI" },
    { id: 14, text: "What excites you more about the future?", options: ["New technological advancements", "Artistic and cultural evolution", "Scientific breakthroughs", "Social and community progress"], trait: "SN" },
    { id: 15, text: "When you see someone being treated unfairly, you...", options: ["Speak up immediately", "Feel upset but stay quiet", "Report it to authorities", "Try to comfort the victim"], trait: "TF" },
    { id: 16, text: "How do you handle unexpected changes in plans?", options: ["Adapt quickly and easily", "Feel anxious but manage", "Get frustrated and stressed", "See it as a new opportunity"], trait: "JP" },
    { id: 17, text: "Your friends would describe you as...", options: ["Outgoing and energetic", "Thoughtful and reserved", "Funny and spontaneous", "Reliable and responsible"], trait: "EI" },
    { id: 18, text: "What kind of problems do you enjoy solving?", options: ["Practical, real-world problems", "Abstract, theoretical problems", "Creative, artistic challenges", "Logical, mathematical puzzles"], trait: "SN" },
    { id: 19, text: "When someone criticizes your work, you...", options: ["Take it as constructive feedback", "Feel personally attacked", "Analyze if the criticism is valid", "Ignore it completely"], trait: "TF" },
    { id: 20, text: "What is your approach to deadlines?", options: ["Finish well before the deadline", "Complete exactly on time", "Submit at the last minute", "Often ask for extensions"], trait: "JP" }
];

const personalityTypes = {
    'INFJ': { name: 'The Advocate', description: 'Creative, insightful, and principled. You have a deep sense of idealism and integrity.' },
    'INTJ': { name: 'The Architect', description: 'Strategic, logical, and innovative. You love complex challenges and patterns.' },
    'ENFP': { name: 'The Campaigner', description: 'Enthusiastic, creative, and sociable. You see possibilities everywhere.' },
    'ENTJ': { name: 'The Commander', description: 'Bold, imaginative, and strong-willed. You are a natural leader.' },
    'INFP': { name: 'The Mediator', description: 'Idealistic, loyal, and open-minded. You care deeply about personal growth.' },
    'ISTJ': { name: 'The Logistician', description: 'Practical, factual, and dependable. You value order and tradition.' },
    'ISFJ': { name: 'The Defender', description: 'Warm, caring, and responsible. You quietly help others.' },
    'ESTJ': { name: 'The Executive', description: 'Efficient, organized, and decisive. You get things done.' },
    'ESFJ': { name: 'The Consul', description: 'Friendly, outgoing, and conscientious. You nurture relationships.' },
    'ISTP': { name: 'The Virtuoso', description: 'Flexible, observant, and practical. You love hands-on work.' },
    'ISFP': { name: 'The Adventurer', description: 'Gentle, sensitive, and artistic. You express yourself creatively.' },
    'ESTP': { name: 'The Entrepreneur', description: 'Energetic, perceptive, and daring. You take risks.' },
    'ESFP': { name: 'The Entertainer', description: 'Spontaneous, enthusiastic, and playful. You love being the center of attention.' },
    'ENTP': { name: 'The Debater', description: 'Smart, curious, and intellectual. You love debating ideas.' },
    'ENFJ': { name: 'The Protagonist', description: 'Charismatic, inspiring, and diplomatic. You help others reach their potential.' },
    'INTP': { name: 'The Thinker', description: 'Innovative, abstract, and logical. You love theoretical concepts.' }
};

// Get MBTI questions
router.get('/questions', (req, res) => {
    console.log('📋 Sending 20 MBTI questions');
    res.json(questions);
});

// Submit MBTI answers
router.post('/submit', auth, async (req, res) => {
    try {
        const { answers } = req.body;
        
        if (!answers || answers.length !== 20) {
            return res.status(400).json({ msg: 'Please answer all 20 questions' });
        }
        
        let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        
        for (let i = 0; i < questions.length; i++) {
            const answer = answers[i];
            const trait = questions[i].trait;
            
            if (trait === 'EI') {
                if (answer === 'A' || answer === 'B') scores.E++;
                else scores.I++;
            }
            else if (trait === 'SN') {
                if (answer === 'A' || answer === 'C') scores.S++;
                else scores.N++;
            }
            else if (trait === 'TF') {
                if (answer === 'A' || answer === 'D') scores.T++;
                else scores.F++;
            }
            else if (trait === 'JP') {
                if (answer === 'A' || answer === 'B') scores.J++;
                else scores.P++;
            }
        }
        
        const type = `${scores.E > scores.I ? 'E' : 'I'}${scores.S > scores.N ? 'S' : 'N'}${scores.T > scores.F ? 'T' : 'F'}${scores.J > scores.P ? 'J' : 'P'}`;
        const personality = personalityTypes[type] || { name: 'The Balanced One', description: 'You have a unique blend of personality traits!' };
        
        // Delete old results
        await MBTIResult.deleteMany({ userId: req.user.userId });
        
        const result = new MBTIResult({
            userId: req.user.userId,
            type: type,
            name: personality.name,
            description: personality.description,
            percentages: {
                introvert: Math.round((scores.I / (scores.E + scores.I)) * 100) || 50,
                intuitive: Math.round((scores.N / (scores.S + scores.N)) * 100) || 50,
                thinking: Math.round((scores.T / (scores.T + scores.F)) * 100) || 50,
                judging: Math.round((scores.J / (scores.J + scores.P)) * 100) || 50
            }
        });
        
        await result.save();
        console.log(`✅ MBTI Result saved: ${type} for user ${req.user.userId}`);
        res.json(result);
        
    } catch (err) {
        console.error('MBTI Submit error:', err);
        res.status(500).json({ msg: err.message });
    }
});

// Get user's MBTI result
router.get('/my-result', auth, async (req, res) => {
    try {
        const result = await MBTIResult.findOne({ userId: req.user.userId }).sort({ takenAt: -1 });
        if (!result) {
            return res.status(404).json({ msg: 'No MBTI result found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Get MBTI result error:', err);
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
