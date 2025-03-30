const express = require('express');
const path = require('path');
const { fetchICPTVL } = require('./fetch-icp-tvl');
const { fetchICPVolume } = require('./fetch-icp-volume');
const { fetchICPPrices } = require('./fetch-icp-prices');

const app = express();
const port = 3000;

// Serve static files from public directory
app.use(express.static('public'));

// API endpoints
app.get('/api/tvl', async (req, res) => {
  try {
    const data = await fetchICPTVL();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/volume', async (req, res) => {
  try {
    const data = await fetchICPVolume();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prices', async (req, res) => {
  try {
    const data = await fetchICPPrices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 