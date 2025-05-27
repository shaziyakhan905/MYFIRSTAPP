const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  status: { type: Boolean, default: true },

},
  {
    timestamps: true // ✅ Correct: passed as the second argument, NOT inside the field definitions
  }
);

module.exports = mongoose.model('State', stateSchema);
