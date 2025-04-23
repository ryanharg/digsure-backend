const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// ✅ Enable CORS for frontend running on localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount all API routes under /v1
app.use('/v1', routes);

// ✅ Optional: Basic root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
