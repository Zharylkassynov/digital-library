const path = require('path');
// Always load .env from the backend folder (next to server.js), not from process.cwd()
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { initAll } = require('./config/db');
const userModel = require('./models/userModel');
const resourcesRoutes = require('./routes/resources');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');
const reportsRoutes = require('./routes/reports');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resources', resourcesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  const port = Number(process.env.PORT || 5000);
  const fallbackPort = port + 1;

  try {
    await initAll();
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && adminEmail.trim()) {
      const r = await userModel.setRoleByEmail(adminEmail, 'admin');
      if (r.changes) {
        console.log(`Role "admin" set for user: ${adminEmail.trim()}`);
      } else {
        console.warn(
          `[ADMIN_EMAIL] No user with email "${adminEmail.trim()}". Register this email first, then restart the server.`
        );
      }
    }
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
