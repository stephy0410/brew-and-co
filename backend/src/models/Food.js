const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  price: Number,
});

module.exports = mongoose.model('Food', foodSchema);
