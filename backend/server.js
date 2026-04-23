const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ============ মিডলওয়্যার (Middleware) ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ফ্রন্টএন্ড ফাইলগুলো সার্ভ করা
app.use(express.static(path.join(__dirname, '../frontend')));

// ============ ডাটাবেস কানেকশন (MongoDB) ============
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB কানেক্ট হয়েছে!'))
  .catch(err => console.log('❌ MongoDB এরর:', err.message));

// ============ রাউটস (Routes) ============
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mbti', require('./routes/mbti'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/suggestions', require('./routes/suggestions'));

// হেলথ চেক রাউট
app.get('/api/health', (req, res) => {
    res.json({ status: 'running', message: 'MindWell API is healthy' });
});

// মেইন পেজ সার্ভ করা
app.get('*path', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============ সার্ভার স্টার্ট ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 সার্ভার চলছে: http://localhost:${PORT}`);
});
