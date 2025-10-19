const express = require('express');
const { loggerMiddleware, NotFoundError } = require('./middleware/middleware');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(loggerMiddleware);
app.use(express.json());

// Root
app.get('/', (req, res) => {
  res.send('Welcome to the Product API!');
});

// Mount product routes
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res, next) => {
  throw new NotFoundError(`Route ${req.method} ${req.url} not found`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  const status = err.statusCode || 500;
  const response = { error: { name: err.name, message: err.message } };
  if (err.details) response.error.details = err.details;
  if (process.env.NODE_ENV !== 'production') response.error.stack = err.stack;
  res.status(status).json(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🔑 API Key: your-secret-api-key-12345`);
});

module.exports = app;
