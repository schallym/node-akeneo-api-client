import nock from 'nock';
import productMock from './mocks/products.mock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import { UpdateProductRequest } from '../src/services/api';

describe('Products API E2E Tests', () => {
  let akeneoClient: AkeneoClient;

  beforeAll(() => {
    akeneoClient = setupAkeneoClient();
  });

  afterAll(() => {
    teardownNock();
  });

  beforeEach(() => {
    setupNock();
  });

  it('should retrieve a draft product', async () => {
    nock(baseUrl).get('/api/rest/v1/products/test_product_123/draft').reply(200, productMock.getDraft);

    const product = await akeneoClient.products.getDraft('test_product_123');

    expect(product).toEqual(productMock.getDraft);
    expect(product.identifier).toBe('test_product_123');
  });

  it('should submit a draft for approval', async () => {
    nock(baseUrl).post('/api/rest/v1/products/test_product_123/proposal').reply(204);

    await akeneoClient.products.submitDraftForApproval('test_product_123');
  });

  it('should update or create multiple products', async () => {
    const products: UpdateProductRequest[] = [
      {
        identifier: 'prod1',
        values: { name: [{ locale: null, scope: null, data: 'Product 1' }] },
      },
      {
        identifier: 'prod2',
        values: { name: [{ locale: null, scope: null, data: 'Product 2' }] },
      },
    ];

    nock(baseUrl).patch('/api/rest/v1/products').reply(200, productMock.updateCreateSeveral);

    const result = await akeneoClient.products.updateOrCreateSeveral(products);

    expect(result).toHaveLength(2);
    expect(result[0].identifier).toBe('prod1');
    expect(result[0].status_code).toBe(201);
    expect(result[1].identifier).toBe('prod2');
  });

  it('should handle API authentication process', async () => {
    nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
      expires_in: 3600,
    });

    nock(baseUrl)
      .get('/api/rest/v1/products/test_product_123/draft')
      .matchHeader('Authorization', 'Bearer new_access_token')
      .reply(200, productMock.getDraft);

    const product = await akeneoClient.products.getDraft('test_product_123');

    expect(product).toEqual(productMock.getDraft);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).get('/api/rest/v1/products/nonexistent_product/draft').reply(404, {
      code: 404,
      message: 'Product "nonexistent_product" does not exist.',
    });

    await expect(akeneoClient.products.getDraft('nonexistent_product')).rejects.toThrow();
  });
});
