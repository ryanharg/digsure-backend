const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../../config/config');


const app = express();
const apiRoutes = require('./routes/v1'); // Assuming this is the correct path

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/v1', apiRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
