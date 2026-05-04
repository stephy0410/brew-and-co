const express = require('express');
const cors = require('cors');
const Drink = require('./models/Drink');
const Mug = require('./models/Mug');
const Food = require('./models/Food');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/drinks', async (req, res) => {
  const drinks = await Drink.find({}, '-_id -__v');
  res.status(200).json(drinks);
});

app.get('/mugs', async (req, res) => {
  const mugs = await Mug.find({}, '-_id -__v');
  res.status(200).json(mugs);
});

app.get('/foods', async (req, res) => {
  const foods = await Food.find({}, '-_id -__v');
  res.status(200).json(foods);
});

app.get('/debug-sentry', (req, res) => {
  throw new Error('Sentry test error from Brew & Co. backend');
});

module.exports = app;
