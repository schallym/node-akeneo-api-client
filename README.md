# Node Akeneo API Client

[![npm version](https://img.shields.io/npm/v/node-akeneo-api-client.svg)](https://www.npmjs.com/package/node-akeneo-api-client)
[![License](https://img.shields.io/github/license/schallym/node-akeneo-api-client.svg)](LICENSE)
[![Coverage Status](https://img.shields.io/codecov/c/github/schallym/node-akeneo-api-client.svg)](https://codecov.io/gh/schallym/node-akeneo-api-client)

A complete and up-to-date Node.js client for the Akeneo PIM REST API. This library provides a simple and intuitive interface to interact with all Akeneo PIM endpoints, supporting both Community and Enterprise editions.

## Features

- 🚀 **Complete API Coverage** - Supports all Akeneo REST API endpoints
- 📦 **TypeScript Support** - Full TypeScript definitions included
- 🔐 **Multiple Authentication Methods** - OAuth2, Client Credentials, and API Token
- 🔄 **Automatic Token Refresh** - Handles token expiration automatically
- 📄 **Pagination Support** - Built-in pagination handling for large datasets
- 🛡️ **Error Handling** - Comprehensive error handling with detailed messages
- 📊 **Rate Limiting** - Respects Akeneo API rate limits
- 🧪 **Well Tested** - Extensive test coverage
- 📚 **Comprehensive Documentation** - Full API documentation with examples

## Installation

```bash
npm install node-akeneo-api-client
```

or

```bash
yarn add node-akeneo-api-client
```

## Quick Start

### Basic Setup

```javascript
const { AkeneoClient } = require('node-akeneo-api-client');

// Initialize with OAuth2 credentials
const client = new AkeneoClient({
  baseUrl: 'https://your-akeneo-instance.com',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  username: 'your-username',
  password: 'your-password'
});

// Or initialize with API token (if using token-based authentication)
const client = new AkeneoClient({
  baseUrl: 'https://your-akeneo-instance.com',
  token: 'your-api-token'
});
```

### Basic Usage Examples

```javascript
// Get all products
const products = await client.products.getAll();

// Get a specific product
const product = await client.products.get('product-sku');

// Create a new product
const newProduct = await client.products.create({
  identifier: 'new-product-sku',
  family: 'accessories',
  values: {
    name: [{
      locale: null,
      scope: null,
      data: 'My New Product'
    }]
  }
});

// Update a product
await client.products.update('product-sku', {
  values: {
    description: [{
      locale: 'en_US',
      scope: null,
      data: 'Updated description'
    }]
  }
});

// Delete a product
await client.products.delete('product-sku');
```

## API Reference

### Client Configuration

```javascript
const client = new AkeneoClient({
  baseUrl: 'https://your-akeneo-instance.com', // Required
  clientId: 'your-client-id',                   // Required for OAuth2
  clientSecret: 'your-client-secret',           // Required for OAuth2
  username: 'your-username',                    // Required for OAuth2
  password: 'your-password',                    // Required for OAuth2
  token: 'your-api-token',                      // Alternative to OAuth2
  timeout: 30000,                               // Request timeout in ms (default: 30000)
  retries: 3,                                   // Number of retries (default: 3)
  retryDelay: 1000,                            // Delay between retries in ms (default: 1000)
  rateLimitDelay: 1000                         // Delay when rate limited (default: 1000)
});
```

### Available Endpoints

#### Products
```javascript
// Get all products with pagination
const products = await client.products.getAll({ limit: 100, page: 1 });

// Get products with filters
const filteredProducts = await client.products.getAll({
  filters: {
    family: 'clothing',
    enabled: true
  }
});

// Get a single product
const product = await client.products.get('product-sku');

// Create a product
const newProduct = await client.products.create(productData);

// Update a product
await client.products.update('product-sku', updateData);

// Delete a product
await client.products.delete('product-sku');
```

#### Product Models
```javascript
// Get all product models
const models = await client.productModels.getAll();

// Get a specific product model
const model = await client.productModels.get('model-code');

// Create a product model
const newModel = await client.productModels.create(modelData);

// Update a product model
await client.productModels.update('model-code', updateData);

// Delete a product model
await client.productModels.delete('model-code');
```

#### Categories
```javascript
// Get all categories
const categories = await client.categories.getAll();

// Get a specific category
const category = await client.categories.get('category-code');

// Create a category
const newCategory = await client.categories.create(categoryData);

// Update a category
await client.categories.update('category-code', updateData);

// Delete a category
await client.categories.delete('category-code');
```

#### Attributes
```javascript
// Get all attributes
const attributes = await client.attributes.getAll();

// Get a specific attribute
const attribute = await client.attributes.get('attribute-code');

// Create an attribute
const newAttribute = await client.attributes.create(attributeData);

// Update an attribute
await client.attributes.update('attribute-code', updateData);

// Delete an attribute
await client.attributes.delete('attribute-code');
```

#### Families
```javascript
// Get all families
const families = await client.families.getAll();

// Get a specific family
const family = await client.families.get('family-code');

// Create a family
const newFamily = await client.families.create(familyData);

// Update a family
await client.families.update('family-code', updateData);

// Delete a family
await client.families.delete('family-code');
```

#### Media Files
```javascript
// Get all media files
const mediaFiles = await client.mediaFiles.getAll();

// Get a specific media file
const mediaFile = await client.mediaFiles.get('media-file-code');

// Upload a media file
const uploadedFile = await client.mediaFiles.upload('path/to/file.jpg');

// Download a media file
const fileBuffer = await client.mediaFiles.download('media-file-code');
```

### Advanced Usage

#### Pagination

```javascript
// Manual pagination
let page = 1;
let allProducts = [];
let hasMore = true;

while (hasMore) {
  const response = await client.products.getAll({ page, limit: 100 });
  allProducts = allProducts.concat(response.data);
  hasMore = response.hasMore;
  page++;
}

// Using the built-in iterator
for await (const product of client.products.iterate()) {
  console.log(product.identifier);
}
```

#### Batch Operations

```javascript
// Batch create products
const products = [
  { identifier: 'product-1', family: 'accessories' },
  { identifier: 'product-2', family: 'accessories' }
];

const results = await client.products.batchCreate(products);

// Batch update products
const updates = [
  { identifier: 'product-1', values: { name: [{ data: 'Updated Name 1' }] } },
  { identifier: 'product-2', values: { name: [{ data: 'Updated Name 2' }] } }
];

const updateResults = await client.products.batchUpdate(updates);
```

#### Error Handling

```javascript
try {
  const product = await client.products.get('non-existent-sku');
} catch (error) {
  if (error.status === 404) {
    console.log('Product not found');
  } else if (error.status === 401) {
    console.log('Authentication failed');
  } else {
    console.log('API Error:', error.message);
  }
}
```

## TypeScript Support

This library is written in TypeScript and includes comprehensive type definitions:

```typescript
import { AkeneoClient, Product, Category, Family } from 'node-akeneo-api-client';

const client = new AkeneoClient({
  baseUrl: 'https://your-akeneo-instance.com',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  username: 'your-username',
  password: 'your-password'
});

// TypeScript will provide full autocompletion and type checking
const products: Product[] = await client.products.getAll();
const category: Category = await client.categories.get('category-code');
```

## Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Development Setup

1. **Fork the repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/node-akeneo-api-client.git
   cd node-akeneo-api-client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

### Contribution Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
    - Write your code
    - Add tests for new functionality
    - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Please follow [Conventional Commits](https://www.conventionalcommits.org/) format.

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

   Go to the original repository and click "New Pull Request".

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint and Prettier)
- Write comprehensive tests for new features
- Update documentation for any API changes
- Keep commits atomic and well-documented

### Reporting Issues

If you find a bug or want to request a feature:

1. Check if the issue already exists in the [Issues](https://github.com/schallym/node-akeneo-api-client/issues) section
2. If not, create a new issue with:
    - Clear description of the problem or feature request
    - Steps to reproduce (for bugs)
    - Expected vs actual behavior
    - Your environment details (Node.js version, OS, etc.)

### Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests (requires Akeneo instance)
npm run test:integration
```

## Examples

Check out the [examples](examples/) directory for more detailed usage examples:

- [Basic CRUD operations](examples/basic-crud.js)
- [Batch operations](examples/batch-operations.js)
- [Product management](examples/product-management.js)
- [Category management](examples/category-management.js)
- [Media file handling](examples/media-files.js)

## API Documentation

For detailed API documentation, visit the [official Akeneo API documentation](https://api.akeneo.com/api-reference-index.html).

## Supported Akeneo Versions

- Akeneo PIM Community Edition 4.0+
- Akeneo PIM Enterprise Edition 4.0+
- Akeneo PIM Cloud Edition

## Requirements

- Node.js 14.0 or higher
- npm 6.0 or higher

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes.

## Support

- 📖 [Documentation](https://github.com/schallym/node-akeneo-api-client/wiki)
- 🐛 [Bug Reports](https://github.com/schallym/node-akeneo-api-client/issues)
- 💬 [Discussions](https://github.com/schallym/node-akeneo-api-client/discussions)
- 📧 [Contact](mailto:your-email@example.com)

## Related Projects

- [Official Akeneo PHP Client](https://github.com/akeneo/api-php-client)
- [Akeneo API Documentation](https://api.akeneo.com/)

## Acknowledgments

- Thanks to all contributors who have helped make this project better
- Inspired by the official Akeneo PHP client
- Built with ❤️ for the Akeneo community

---

Made with ❤️ by [schallym](https://github.com/schallym) and [contributors](https://github.com/schallym/node-akeneo-api-client/graphs/contributors).
