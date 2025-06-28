import { Product } from '../../src/types';

const productsMock: Product = {
  uuid: '1234-5678-9012',
  identifier: 'test_product_123',
  enabled: true,
  family: 'tables',
  categories: ['diningtables'],
  groups: ['group1'],
  created: '2023-01-01T00:00:00Z',
  updated: '2023-01-02T00:00:00Z',
  values: {
    name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
    description: [{ locale: 'en_US', scope: null, data: 'This is a test product.' }],
  },
};

export default {
  get: productsMock,
  updateCreateSeveral: [
    {
      line: 1,
      identifier: 'prod1',
      status_code: 201,
      message: 'Product prod1 created successfully.',
    },
    {
      line: 2,
      identifier: 'prod2',
      status_code: 201,
      message: 'Product prod2 created successfully.',
    },
  ]
    .map((item) => JSON.stringify(item))
    .join('\n'),
  list: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/products?page=2' },
      first: { href: 'https://akeneo.test/api/rest/v1/products' },
    },
    current_page: 1,
    _embedded: {
      items: [productsMock],
    },
  },
  getDraft: productsMock,
};
