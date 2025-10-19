How to Run the Server
1. Clone the repository
git clone https://github.com/your-username/express-js-server-side-framework-Thamir-004.git
cd express-js-server-side-framework-Thamir-004

2. Install dependencies
npm install

3. Start the server
node server.js

4. Access the API

Once the server starts, you’ll see:

Server is running on http://localhost:3000
API Key for testing: your-secret-api-key-12345


All /api/products/* endpoints require a request header:

x-api-key: your-secret-api-key-12345

 API Documentation
 Base URL
http://localhost:3000

1. GET /api/products

Retrieve all products with optional pagination and category filtering.

Query Parameters:

Name	Type	Description
category	string	Filter by category (e.g., electronics)
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)

Example Request:

GET /api/products?category=electronics&page=1&limit=2
Headers:
x-api-key: your-secret-api-key-12345


Example Response:

{
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 2,
    "totalItems": 3,
    "totalPages": 2
  }
}

2. GET /api/products/:id

Fetch a single product by its ID.

Example Request:

GET /api/products/1
x-api-key: your-secret-api-key-12345


Example Response:

{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}

3. GET /api/products/search

Search for products by name or description.

Query Parameter:

Name	Type	Description
q	string	Search term

Example Request:

GET /api/products/search?q=laptop
x-api-key: your-secret-api-key-12345


Example Response:

{
  "query": "laptop",
  "count": 1,
  "results": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}

4. GET /api/products/stats

Returns overall product statistics and category breakdown.

Example Request:

GET /api/products/stats
x-api-key: your-secret-api-key-12345


Example Response:

{
  "totalProducts": 5,
  "inStock": 4,
  "outOfStock": 1,
  "averagePrice": 465.4,
  "totalValue": 2327,
  "byCategory": {
    "electronics": { "count": 3, "inStock": 3, "totalValue": 2029.99 },
    "kitchen": { "count": 1, "inStock": 0, "totalValue": 50 },
    "furniture": { "count": 1, "inStock": 1, "totalValue": 249.99 }
  }
}

5. POST /api/products

Create a new product.

Headers:

Content-Type: application/json
x-api-key: your-secret-api-key-12345


Request Body:

{
  "name": "Gaming Keyboard",
  "description": "Mechanical keyboard with RGB lighting",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}


Example Response:

{
  "id": "b9130f9f-ced3-4cb9-a543-91d8c1d721ef",
  "name": "Gaming Keyboard",
  "description": "Mechanical keyboard with RGB lighting",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}

6. PUT /api/products/:id

Update an existing product.

Request Example:

PUT /api/products/1
x-api-key: your-secret-api-key-12345
Content-Type: application/json


Body:

{
  "name": "Laptop Pro",
  "description": "Upgraded high-performance laptop with 32GB RAM",
  "price": 1800,
  "category": "electronics",
  "inStock": true
}


Response:

{
  "id": "1",
  "name": "Laptop Pro",
  "description": "Upgraded high-performance laptop with 32GB RAM",
  "price": 1800,
  "category": "electronics",
  "inStock": true
}

7. DELETE /api/products/:id

Delete a product by ID.

Request Example:

DELETE /api/products/2
x-api-key: your-secret-api-key-12345


Response:

{
  "message": "Product deleted successfully",
  "product": {
    "id": "2",
    "name": "Smartphone",
    "description": "Latest model with 128GB storage",
    "price": 800,
    "category": "electronics",
    "inStock": true
  }
}

 Error Handling

All errors follow a consistent JSON format:

Example (Validation Error):

{
  "error": {
    "name": "ValidationError",
    "message": "Validation failed",
    "details": [
      "price is required",
      "category is required"
    ]
  }
}


Example (Unauthorized Request):

{
  "error": {
    "name": "AuthorizationError",
    "message": "Invalid API key"
  }
}