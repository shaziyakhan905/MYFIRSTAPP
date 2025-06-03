const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: null
  },
  stock: {
    type: Number,
    default: 0
  },
   productImage: {
    data: {
    type: Buffer,
    default: null
  },
  contentType: {
    type: String,
    default: null
  }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
})

module.exports = mongoose.model("Product",productSchema)