import nock from 'nock';
import AkeneoApiClient from '../src/services/akeneo-api-client';
import { ProductIdentifierApi } from '../src/services/api';
import productMock from './mocks/product.mock';
import { Product } from '../src/types';

describe('Product API E2E Tests', () => {
  const baseUrl = 'https://akeneo.test';
  let akeneoClient: AkeneoApiClient;
  let productApi: ProductIdentifierApi;

  beforeAll(() => {
    akeneoClient = new AkeneoApiClient({
      baseUrl,
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    });

    productApi = new ProductIdentifierApi(akeneoClient);
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
    nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
      expires_in: 3600,
    });
  });

  it('should retrieve a draft product', async () => {
    nock(baseUrl).get('/api/rest/v1/products/test_product_123/draft').reply(200, productMock.getDraft);

    const product = await productApi.getDraft('test_product_123');

    expect(product).toEqual(productMock.getDraft);
    expect(product.identifier).toBe('test_product_123');
  });

  it('should submit a draft for approval', async () => {
    nock(baseUrl).post('/api/rest/v1/products/test_product_123/proposal').reply(204);

    await productApi.submitDraftForApproval('test_product_123');
  });

  it('should update or create multiple products', async () => {
    const products: Partial<Product>[] = [
      {
        identifier: 'prod1',
        values: { name: [{ locale: null, scope: null, data: 'Product 1' }] },
      },
      {
        identifier: 'prod2',
        values: { name: [{ locale: null, scope: null, data: 'Product 2' }] },
      },
    ];

    nock(baseUrl).patch('/api/rest/v1/products/test_product_123').reply(200, productMock.updateCreateSeveral);

    const result = await productApi.updateOrCreateSeveral('test_product_123', products);

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
      .reply(200, productMock);

    const product = await productApi.getDraft('test_product_123');

    expect(product).toEqual(productMock);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).get('/api/rest/v1/products/nonexistent_product/draft').reply(404, {
      code: 404,
      message: 'Product "nonexistent_product" does not exist.',
    });

    await expect(productApi.getDraft('nonexistent_product')).rejects.toThrow();
  });
});
