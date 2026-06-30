require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const childrenRoutes = require('./routes/children');
const tasksRoutes = require('./routes/tasks');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'maacare-dev-secret-change-in-production')) {
  console.error('FATAL: Set JWT_SECRET environment variable in production.');
  process.exit(1);
}

app.set('trust proxy', 1);

const corsOrigin = process.env.CORS_ORIGIN || '*';

console.log('NODE_ENV =', process.env.NODE_ENV);
console.log('CORS_ORIGIN =', process.env.CORS_ORIGIN);
console.log('Using CORS origin =', corsOrigin);
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'MaaCare API',
    version: '1.0.0',
    environment: isProduction ? 'production' : 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/progress', progressRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`MaaCare API running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
});
