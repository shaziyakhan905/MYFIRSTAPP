// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // optional but useful
  questionText: { type: String, required: true },
  questionContent: { type: String },
  type: {
    type: String,
    enum: ['radio', 'checkbox', 'textarea'],
    required: true,
  },
  options: [String], // radio/checkbox
  correctAnswers: [Number]
});

module.exports = mongoose.model('Question', questionSchema);
