import { ProductModelType } from '../../src/types';

const productModelsMock: ProductModelType = {
  code: 'code123',
  family: 'tables',
  family_variant: 'table_variant',
  categories: ['diningtables'],
  groups: ['group1'],
  created: '2023-01-01T00:00:00Z',
  updated: '2023-01-02T00:00:00Z',
  values: {
    name: [{ locale: 'en_US', scope: null, data: 'Test Product model' }],
    description: [{ locale: 'en_US', scope: null, data: 'This is a test product model.' }],
  },
};

export default {
  get: productModelsMock,
  updateCreateSeveral: [
    {
      line: 1,
      code: 'code1',
      status_code: 201,
      message: 'Product model code1 created successfully.',
    },
    {
      line: 2,
      code: 'code2',
      status_code: 201,
      message: 'Product model code2 created successfully.',
    },
  ]
    .map((item) => JSON.stringify(item))
    .join('\n'),
  list: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/product-models?page=2' },
      first: { href: 'https://akeneo.test/api/rest/v1/product-models' },
    },
    current_page: 1,
    _embedded: {
      items: [productModelsMock],
    },
  },
  getDraft: productModelsMock,
};
