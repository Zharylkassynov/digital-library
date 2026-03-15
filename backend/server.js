const express = require('express');
const cors = require('cors');
const path = require('path');
const { initTable } = require('./config/db');
const resourcesRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/resources', resourcesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  const port = Number(process.env.PORT || 5000);
  const fallbackPort = port + 1;

  try {
    await initTable();
  } catch (err) {
    console.error('Failed to init database:', err);
    process.exit(1);
  }

  function listen(onPort) {
    const server = app.listen(onPort, () => {
      console.log(`Server running at http://localhost:${onPort}`);
      if (onPort !== port) {
        console.log(`(Port ${port} was in use, using ${onPort} instead. Set VITE_API_URL=http://localhost:${onPort} in frontend if needed.)`);
      }
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && onPort === port) {
        console.warn(`Port ${port} is in use, trying ${fallbackPort}...`);
        listen(fallbackPort);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  }

  listen(port);
}

start();
