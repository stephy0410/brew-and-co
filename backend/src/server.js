require('./instrument');
require('dotenv').config();
const Sentry = require('@sentry/node');
const app = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 3000;

Sentry.setupExpressErrorHandler(app);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Brew & Co. backend running on port ${PORT}`);
  });
});
