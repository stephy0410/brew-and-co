const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const Drink = require('./models/Drink');
const Mug = require('./models/Mug');
const Food = require('./models/Food');
const User = require('./models/User');
const Order = require('./models/Order');
const Favorite = require('./models/Favorite');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('./config');
const { auth, requireSelf } = require('./middleware/auth');

const app = express();

// Restrict CORS to the known frontend origin(s). CORS_ORIGIN is a
// comma-separated list; defaults cover local dev.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, cb) {
    // allow same-origin / curl / server-to-server (no Origin header)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
// Strip keys containing `$` or `.` so request bodies can't smuggle Mongo
// query operators (NoSQL injection).
app.use(mongoSanitize());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later' },
});

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const signToken = (user) => jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ── Products ────────────────────────────────────────────────
app.get('/drinks', async (req, res) => {
  const drinks = await Drink.find({}, '-__v');
  res.status(200).json(drinks);
});

app.get('/mugs', async (req, res) => {
  const mugs = await Mug.find({}, '-__v');
  res.status(200).json(mugs);
});

app.get('/foods', async (req, res) => {
  const foods = await Food.find({}, '-__v');
  res.status(200).json(foods);
});

// ── Auth & User ─────────────────────────────────────────────
app.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const storeCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user = await User.create({ name, email, password, storeCode });
    return res.status(201).json({ user, token: signToken(user) });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: 'Email already registered' });
    return res.status(400).json({ error: e.message });
  }
});

app.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.json({ user, token: signToken(user) });
});

// GET /user/:id → fetch latest user data (session refresh on app load)
app.get('/user/:id', auth, requireSelf('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.json(user);
  } catch (e) { return res.status(400).json({ error: e.message }); }
});

// Fields a client must never be able to set through a profile update.
const IMMUTABLE_USER_FIELDS = ['password', '_id', '__v', 'storeCode'];

app.put('/user/:id', auth, requireSelf('id'), async (req, res) => {
  try {
    const update = { ...req.body };
    IMMUTABLE_USER_FIELDS.forEach((f) => delete update[f]);
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.json(user);
  } catch (e) { return res.status(400).json({ error: e.message }); }
});

app.post('/user/:id/password', auth, requireSelf('id'), async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword)) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const user = await User.findById(req.params.id).select('+password');
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }
  user.password = newPassword;
  await user.save();
  return res.json({ success: true });
});

app.delete('/user/:id', auth, requireSelf('id'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ success: true, message: 'Account deleted successfully' });
  } catch (e) { return res.status(400).json({ error: e.message }); }
});

// ── Orders ──────────────────────────────────────────────────
app.get('/orders/:userId', auth, requireSelf('userId'), async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ date: -1 });
  return res.json(orders);
});

app.post('/orders', auth, async (req, res) => {
  try {
    // Force the order onto the authenticated user; ignore any client userId.
    const order = await Order.create({ ...req.body, userId: req.userId });
    return res.status(201).json(order);
  } catch (e) { return res.status(400).json({ error: e.message }); }
});

if (process.env.NODE_ENV !== 'production') {
  app.get('/debug-sentry', () => {
    throw new Error('Sentry test error from Brew & Co. backend');
  });
}

// JSON error handler — keeps stack traces out of responses regardless of
// NODE_ENV. (Registered here so it also applies under supertest; in
// server.js the Sentry error handler runs before the app is listened on.)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message,
  });
});

module.exports = app;
