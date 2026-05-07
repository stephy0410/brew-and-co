const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  stars: { type: Number, default: 0 },
  freeProducts: { type: Number, default: 0 },
  favorites: [Number],
  usedCodes: [String],
  rewardsHistory: [{
    date: Date,
    type: String,
    stars: Number,
    itemCount: Number
  }]
});

module.exports = mongoose.model('User', userSchema);
