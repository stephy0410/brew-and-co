const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const menuItems = [
  { id: 1, name: 'Espresso', price: 2.50, category: 'coffee' },
  { id: 2, name: 'Cappuccino', price: 3.50, category: 'coffee' },
  { id: 3, name: 'Latte', price: 4.00, category: 'coffee' },
  { id: 4, name: 'Croissant', price: 2.00, category: 'food' },
  { id: 5, name: 'Blueberry Muffin', price: 2.50, category: 'food' },
];

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/menu', (req, res) => {
  res.status(200).json(menuItems);
});

app.get('/menu/:id', (req, res) => {
  const item = menuItems.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.status(200).json(item);
});

module.exports = app;
