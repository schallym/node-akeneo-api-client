import { PaginatedResponse, ProductAssociationsResponse, ProductProposal, ProductUuid } from '../../src';

const productsUuidMock: ProductUuid = {
  uuid: '1234-5678-9012',
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
  get: productsUuidMock,
  updateCreateSeveral: [
    {
      line: 1,
      uuid: 'prod1',
      status_code: 201,
      message: 'Product prod1 created successfully.',
    },
    {
      line: 2,
      uuid: 'prod2',
      status_code: 201,
      message: 'Product prod2 created successfully.',
    },
  ]
    .map((item) => JSON.stringify(item))
    .join('\n'),
  list: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/products-uuid?page=2' },
      first: { href: 'https://akeneo.test/api/rest/v1/products-uuid' },
    },
    current_page: 1,
    _embedded: {
      items: [productsUuidMock],
    },
  },
  getDraft: productsUuidMock,
  getDraftWithProposalReviewStatus: {
    ...productsUuidMock,
    metadata: { workflow_status: 'proposal_waiting_for_approval' },
    proposal_review_status: {
      values: {
        description: [{ locale: 'en_US', scope: null, review_status: 'to_review' }],
        name: [{ locale: 'en_US', scope: null, review_status: 'draft' }],
      },
    },
  } satisfies ProductUuid,
  search: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/products-uuid/search' },
      first: { href: 'https://akeneo.test/api/rest/v1/products-uuid/search' },
    },
    current_page: 1,
    items_count: 1,
    _embedded: {
      items: [productsUuidMock],
    },
  },
  getAssociations: {
    _links: {
      self: { href: 'https://demo.akeneo.com/api/rest/v1/products-uuid/1234-5678-9012/associations?limit=10' },
      first: { href: 'https://demo.akeneo.com/api/rest/v1/products-uuid/1234-5678-9012/associations?limit=10' },
      next: {
        href: 'https://demo.akeneo.com/api/rest/v1/products-uuid/1234-5678-9012/associations?limit=10&search_after=abc',
      },
    },
    _embedded: {
      items: [
        {
          association_type: 'X_SELL',
          type: 'product',
          id: '25566245-55e4-4d9a-8b8b-2c1d1b0c6e3f',
          identifier: 'big_boot',
        },
        { association_type: 'X_SELL', type: 'product_model', id: 'amor' },
        { association_type: 'X_SELL', type: 'group', id: 'similar_boots' },
        {
          association_type: 'PACK',
          type: 'product',
          id: '5b8e1c0b-4c1e-4f4e-9a4b-6f0b9d1c2a3e',
          identifier: null,
          quantity: 2,
        },
        { association_type: 'PACK', type: 'product_model', id: 'apollon', quantity: 3 },
      ],
    },
  } satisfies ProductAssociationsResponse,
  getProposal: {
    product_uuid: '1234-5678-9012',
    author: 'mary',
    created: '2026-10-27T09:12:38+00:00',
    values: {
      description: [{ locale: 'en_US', scope: 'ecommerce', data: 'A comfortable cotton t-shirt' }],
    },
  } satisfies ProductProposal,
  listProposals: {
    _links: {
      self: { href: 'https://demo.akeneo.com/api/rest/v1/product-proposals?page=1&limit=10&with_count=true' },
      first: { href: 'https://demo.akeneo.com/api/rest/v1/product-proposals?page=1&limit=10&with_count=true' },
    },
    current_page: 1,
    items_count: 1,
    _embedded: {
      items: [
        {
          _links: { self: { href: 'https://demo.akeneo.com/api/rest/v1/product-proposals/1234-5678-9012/mary' } },
          product_uuid: '1234-5678-9012',
          author: 'mary',
          created: '2026-10-27T09:12:38+00:00',
          values: {
            description: [{ locale: 'en_US', scope: 'ecommerce', data: 'A comfortable cotton t-shirt' }],
            weight: [{ locale: null, scope: null, data: { amount: '1.5', unit: 'KILOGRAM' } }],
          },
        },
      ],
    },
  } satisfies PaginatedResponse<ProductProposal>,
};
