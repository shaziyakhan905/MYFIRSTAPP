const mongoose = require('mongoose');

// Category Schema
const newscategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

// News Schema
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author:  {
    type: String,
    required: true
  },
 image: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String // HTML content
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, { timestamps: true });

// Models
const newsCategory = mongoose.model('newsCategory', newscategorySchema);
const News = mongoose.model('News', newsSchema);

// Export
module.exports = {
  News,
  newsCategory
};
