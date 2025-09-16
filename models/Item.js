const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // --- CHANGE START ---
  // The 'image' field is replaced by an 'images' array
  images: {
    type: [String], // This defines an array of strings
    required: true
  },
  // --- CHANGE END ---
  category: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  itemType: { // e.g., 'Item' for trade/giveaway, 'Scrap' for recycling
    type: String,
    required: true,
    default: 'Item'
  },
  status: {
    type: String,
    required: true,
    default: 'Available'
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;