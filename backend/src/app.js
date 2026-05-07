const express = require('express');
const cors = require('cors');
const Drink = require('./models/Drink');
const Mug = require('./models/Mug');
const Food = require('./models/Food');
const User = require('./models/User');
const Order = require('./models/Order');
const Favorite = require('./models/Favorite');

const app = express();

app.use(cors());
app.use(express.json());

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
app.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (e) { res.status(400).json({ error: e.message }) }
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email, password: req.body.password });
  if (user) res.json(user); else res.status(401).json({ error: 'Invalid credentials' });
});

// GET /user/:id → fetch latest user data (session refresh on app load)
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (e) { res.status(400).json({ error: e.message }) }
});

app.put('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (e) { res.status(400).json({ error: e.message }) }
});

// ── Orders ──────────────────────────────────────────────────
app.get('/orders/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(orders);
});

app.post('/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (e) { res.status(400).json({ error: e.message }) }
});

app.get('/debug-sentry', (req, res) => {
  throw new Error('Sentry test error from Brew & Co. backend');
});

module.exports = app;
