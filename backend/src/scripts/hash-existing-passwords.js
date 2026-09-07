// One-time migration: bcrypt-hash any user passwords still stored in plaintext.
// Run once after deploying the auth changes, otherwise existing users can no
// longer log in (bcrypt.compare against a plaintext value always fails).
//
//   MONGODB_URI="..." node src/scripts/hash-existing-passwords.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../db');
const User = require('../models/User');

const looksHashed = (v) => typeof v === 'string' && /^\$2[aby]\$/.test(v);

(async () => {
  await connectDB();
  const users = await User.find({}).select('+password');
  let migrated = 0;

  for (const user of users) {
    if (!user.password || looksHashed(user.password)) continue;
    const hashed = await bcrypt.hash(user.password, 12);
    // updateOne bypasses the pre-save hook so we don't double-hash
    await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
    migrated += 1;
  }

  console.log(`Done. Hashed ${migrated} plaintext password(s) of ${users.length} user(s).`);
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
