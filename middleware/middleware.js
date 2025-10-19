// ==================== CUSTOM ERROR CLASSES ====================

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

// ==================== ASYNC WRAPPER ====================

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== MIDDLEWARE ====================

// 1. Logger
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// 2. Authentication
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    throw new AuthenticationError('API key is required. Please provide x-api-key header.');
  }

  const validApiKey = 'your-secret-api-key-12345';

  if (apiKey !== validApiKey) {
    throw new AuthorizationError('Invalid API key');
  }

  next();
};

// 3. Product Validation
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description is required and must be a non-empty string');
  }

  if (price === undefined || price === null) {
    errors.push('price is required');
  } else if (typeof price !== 'number' || price < 0) {
    errors.push('price must be a positive number');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('category is required and must be a non-empty string');
  }

  if (inStock === undefined || inStock === null) {
    errors.push('inStock is required');
  } else if (typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean');
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  next();
};

module.exports = {
  loggerMiddleware,
  authMiddleware,
  validateProduct,
  asyncHandler,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError
};
