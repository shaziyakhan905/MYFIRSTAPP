const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  status: { type: Boolean, default: true },

},
  {
    timestamps: true // ✅ Correct: passed as the second argument, NOT inside the field definitions
  }
);

module.exports = mongoose.model('Country', countrySchema);
