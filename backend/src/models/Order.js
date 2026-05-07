const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: String,
  itemCount: Number,
  total: Number,
  stars: Number,
  date: { type: Date, default: Date.now },
  items: String,
});

module.exports = mongoose.model('Order', orderSchema);
