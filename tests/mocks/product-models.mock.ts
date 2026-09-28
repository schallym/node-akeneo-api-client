import { ProductModelType } from '../../src';

const productModelsMock: ProductModelType = {
  code: 'code123',
  family: 'tables',
  family_variant: 'table_variant',
  categories: ['diningtables'],
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
  getWithProductUuidsAssociations: {
    ...productModelsMock,
    associations: {
      X_SELL: {
        groups: [],
        products: ['d2f3a1b4-5c6d-4e7f-8a9b-0c1d2e3f4a5b', 'a1b2c3d4-e5f6-4789-9abc-def012345678'],
        product_models: ['model_code'],
      },
    },
  } satisfies ProductModelType,
  listWithProductUuidsAssociations: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/product-models' },
      first: { href: 'https://akeneo.test/api/rest/v1/product-models' },
    },
    current_page: 1,
    _embedded: {
      items: [
        {
          ...productModelsMock,
          associations: {
            X_SELL: {
              groups: [],
              products: ['d2f3a1b4-5c6d-4e7f-8a9b-0c1d2e3f4a5b'],
              product_models: [],
            },
          },
        } satisfies ProductModelType,
      ],
    },
  },
  getDraft: productModelsMock,
  getDraftWithProposalReviewStatus: {
    ...productModelsMock,
    metadata: { workflow_status: 'proposal_waiting_for_approval' },
    proposal_review_status: {
      values: {
        description: [{ locale: 'en_US', scope: null, review_status: 'to_review' }],
        name: [{ locale: 'en_US', scope: null, review_status: 'draft' }],
      },
    },
  } satisfies ProductModelType,
};
