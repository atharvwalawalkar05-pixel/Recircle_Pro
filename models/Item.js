const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'],
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Item', 'Scrap'],
  },
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;