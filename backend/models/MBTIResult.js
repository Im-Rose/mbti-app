const mongoose = require('mongoose');

const MBTIResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  name: String,
  description: String,
  percentages: {
    introvert: Number,
    intuitive: Number,
    thinking: Number,
    judging: Number
  },
  takenAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MBTIResult', MBTIResultSchema);
