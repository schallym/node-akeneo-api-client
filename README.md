# Node Akeneo API Client

[![npm version](https://img.shields.io/npm/v/node-akeneo-api-client.svg)](https://www.npmjs.com/package/node-akeneo-api-client)
[![License](https://img.shields.io/github/license/schallym/node-akeneo-api-client.svg)](LICENSE)
[![Coverage Status](https://img.shields.io/codecov/c/github/schallym/node-akeneo-api-client.svg)](https://codecov.io/gh/schallym/node-akeneo-api-client)

A complete and up-to-date Node.js client for the Akeneo PIM REST API. This library provides a simple and intuitive interface to interact with all Akeneo PIM endpoints, supporting both Community and Enterprise editions.

## Features

- 🚀 **Complete API Coverage** - Supports all Akeneo REST API endpoints
- 📦 **TypeScript Support** - Full TypeScript definitions included
- 🔐 **Multiple Authentication Methods** - Classic connection and App connection
- 🔄 **Automatic Token Refresh** - Handles token expiration automatically
- 📄 **Pagination Support** - Built-in pagination handling for large datasets
- 🛡️ **Error Handling** - Comprehensive error handling with detailed messages
- 🧪 **Well Tested** - Extensive test coverage

## Installation

```bash
npm install @schally/node-akeneo-api-client
```

## Quick Start

### Basic Setup

```javascript
const { AkeneoClient } = require('@schally/node-akeneo-api-client');

// Initialize with classic connection
const client = new AkeneoClient({
  baseUrl: 'https://your-akeneo-instance.com',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  username: 'your-username',
  password: 'your-password'
});

// Or initialize with App token
const client = new AkeneoClient({
  baseUrl: 'https://your-akeneo-instance.com',
  accessToken: 'your-app-token',
  clientId: 'app-client-id',
});
```

### Basic Usage Examples

```javascript
// List activated products with count
const products = await client.products.list({ 
    limit: 100,
    search: JSON.stringify({ enabled: [{ operator: '=', value: true }] }), 
    with_count: true
});

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

### Available Endpoints

Please refer to the [official Akeneo API documentation](https://api.akeneo.com/api-reference-index.html) for detailed information on each endpoint.

### Error Handling

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

# Run tests with coverage
npm run test:coverage

# Run integration tests (requires Akeneo instance)
npm run test:integration
```

## Supported Akeneo Versions

- Akeneo PIM Cloud Edition

Most API endpoints are supported for both Community and Enterprise editions, but some features may be exclusive to the Cloud edition. 
Always refer to the [Akeneo API documentation](https://api.akeneo.com/api-reference-index.html) for specific endpoint availability.

## Requirements

- Node.js 20.0 or higher

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes.

## Support

- 🐛 [Bug Reports](https://github.com/schallym/node-akeneo-api-client/issues)

## Related Projects

- [Official Akeneo PHP Client](https://github.com/akeneo/api-php-client)
- [Akeneo API Documentation](https://api.akeneo.com/)

## Acknowledgments

- Thanks to all contributors who have helped make this project better
- Built with ❤️ for the Akeneo community

---

Made with ❤️ by [schallym](https://github.com/schallym) and [contributors](https://github.com/schallym/node-akeneo-api-client/graphs/contributors).
