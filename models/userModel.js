const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  mobileNo: {
    type: Number,
    default: null,
    match: /^[0-9]{10,15}$/ // optional: regex for 10 to 15 digits
  },
  emailId: {
    type: String,
    default: null,
  },
 countryId: {
   type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
   },
  stateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'State' 
  },
  cityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'City'
   },
},

 {
    timestamps: true // ✅ Correct: passed as the second argument, NOT inside the field definitions
  }
);


module.exports = mongoose.model('User', usersSchema);