require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Drink = require('./models/Drink');
const Mug = require('./models/Mug');
const Food = require('./models/Food');

const drinks = [
  { id: 1, name: 'Star Latte', description: 'Iced', price: 89 },
  { id: 2, name: 'Cappuccino', description: 'Hot', price: 75 },
  { id: 3, name: 'Cold Brew', description: 'Iced', price: 79 },
  { id: 4, name: 'Iced Matcha', description: 'Iced', price: 85 },
];

const mugs = [
  { id: 1, name: 'Purple Flower Mug', price: 380 },
  { id: 2, name: 'Blue Star Mug', price: 380 },
  { id: 3, name: 'Pink Lily Mug', price: 380 },
  { id: 4, name: 'Tulip Mug', price: 380 },
];

const foods = [
  { id: 1, name: 'Cinnamon Roll', description: 'Warm, glazed, freshly baked', price: 65 },
  { id: 2, name: 'Choco Chip Muffin', description: 'Double chocolate chips', price: 55 },
  { id: 3, name: 'Choco Chunk Cookies', description: 'Crispy edges, soft center', price: 58 },
  { id: 4, name: 'Salmon Avocado Toast', description: 'Smoked salmon, cream cheese', price: 95 },
];

const seed = async () => {
  await connectDB();
  await Drink.deleteMany({});
  await Mug.deleteMany({});
  await Food.deleteMany({});
  await Drink.insertMany(drinks);
  await Mug.insertMany(mugs);
  await Food.insertMany(foods);
  console.log('Database seeded successfully');
  mongoose.connection.close();
};

seed();
