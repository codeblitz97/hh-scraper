const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const createError = require('http-errors');
const hentaiRoutes = require('./routes/hentaiRoutes');

const app = express();

app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 1000,
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/hentai', hentaiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HentaiTown API!',
  });
});

app.use((req, res, next) => {
  next(createError(404, { message: 'Route not found' }));
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
