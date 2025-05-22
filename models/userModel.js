const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {
      type: String,
      default: null,
    },
    mobileNo: {
      type: String,
      default: null,
    },
    emailId: {
      type: String,
      default: null,
    }
  });

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;