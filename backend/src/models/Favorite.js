const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: Number,
  productName: String,
  productType: { type: String, enum: ['drink', 'mug', 'food'] },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
