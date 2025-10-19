const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const {
  asyncHandler,
  authMiddleware,
  validateProduct,
  NotFoundError,
  ValidationError
} = require('../middleware/middleware');

// In-memory product database
let products = [
  { id: '1', name: 'Laptop', description: 'High-performance laptop with 16GB RAM', price: 1200, category: 'electronics', inStock: true },
  { id: '2', name: 'Smartphone', description: 'Latest model with 128GB storage', price: 800, category: 'electronics', inStock: true },
  { id: '3', name: 'Coffee Maker', description: 'Programmable coffee maker with timer', price: 50, category: 'kitchen', inStock: false },
  { id: '4', name: 'Desk Chair', description: 'Ergonomic office chair with lumbar support', price: 249.99, category: 'furniture', inStock: true },
  { id: '5', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', price: 29.99, category: 'electronics', inStock: true }
];

// GET /api/products/search
router.get('/search', authMiddleware, asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) throw new ValidationError('Search query parameter "q" is required');

  const searchTerm = q.toLowerCase();
  const results = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  );

  res.json({ query: q, count: results.length, results });
}));

// GET /api/products/stats
router.get('/stats', authMiddleware, asyncHandler(async (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    byCategory: {},
  };

  products.forEach(p => {
    if (!stats.byCategory[p.category]) {
      stats.byCategory[p.category] = { count: 0, inStock: 0 };
    }
    stats.byCategory[p.category].count++;
    if (p.inStock) stats.byCategory[p.category].inStock++;
  });

  res.json(stats);
}));

// GET /api/products
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  let filtered = products;
  if (category) {
    filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  if (pageNum < 1 || limitNum < 1) throw new ValidationError('Page and limit must be positive numbers');

  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  res.json({
    data: paginated,
    pagination: {
      currentPage: pageNum,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum)
    }
  });
}));

// GET /api/products/:id
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) throw new NotFoundError(`Product with id ${req.params.id} not found`);
  res.json(product);
}));

// POST /api/products
router.post('/', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = { id: uuidv4(), name, description, price, category, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// PUT /api/products/:id
router.put('/:id', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) throw new NotFoundError(`Product with id ${req.params.id} not found`);
  const updated = { id: req.params.id, ...req.body };
  products[index] = updated;
  res.json(updated);
}));

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) throw new NotFoundError(`Product with id ${req.params.id} not found`);
  const deleted = products.splice(index, 1)[0];
  res.json({ message: 'Product deleted successfully', product: deleted });
}));

module.exports = router;
