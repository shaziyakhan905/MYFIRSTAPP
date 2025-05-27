const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    default: null

  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
},
  {
    timestamps: true // ✅ Correct: passed as the second argument, NOT inside the field definitions
  }
);

module.exports = mongoose.model('City', citySchema);
