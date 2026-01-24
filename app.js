require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectToMongo } = require('./database/mongo');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3000;

// body parsers
app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// static frontend
app.use(express.static(path.join(__dirname, 'public')));

// root -> frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/api/appointments', appointmentsRouter);

// API 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// HTML 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

async function start() {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
