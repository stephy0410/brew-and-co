const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  // select: false → never returned by queries unless explicitly asked for
  password: { type: String, select: false },
  storeCode: { type: String, unique: true, sparse: true },
  stars: { type: Number, default: 0 },
  freeProducts: { type: Number, default: 0 },
  favorites: [String],
  usedCodes: [String],
  rewardsHistory: [{
    date: Date,
    type: String,
    stars: Number,
    itemCount: Number
  }]
});

// Hash the password whenever it is set/changed. findByIdAndUpdate does NOT
// trigger this hook, which is why password changes go through .save().
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Defence in depth: strip password/__v from any serialised user.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
