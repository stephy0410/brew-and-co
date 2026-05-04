const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  price: Number,
});

module.exports = mongoose.model('Drink', drinkSchema);
