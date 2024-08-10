const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
 pictures: {
    type: [String], // Array to store image URLs or names
   
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
},
 {
  timestamps: true // Optional: Adds createdAt and updatedAt timestamps
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
