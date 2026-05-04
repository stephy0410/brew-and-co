const mongoose = require('mongoose');

const mugSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
});

module.exports = mongoose.model('Mug', mugSchema);
