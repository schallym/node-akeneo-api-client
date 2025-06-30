import nock from 'nock';
import { AkeneoApiClient } from '../src/services';
import { ProductModelsApi, UpdateProductModelRequest } from '../src/services/api';
import productModelsMock from './mocks/product-models.mock';

describe('Product models API E2E Tests', () => {
  const baseUrl = 'https://akeneo.test';
  let akeneoClient: AkeneoApiClient;
  let productModelsApi: ProductModelsApi;

  beforeAll(() => {
    akeneoClient = new AkeneoApiClient({
      baseUrl,
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    });

    productModelsApi = new ProductModelsApi(akeneoClient);
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

  it('should retrieve a draft product model', async () => {
    nock(baseUrl).get('/api/rest/v1/product-models/code123/draft').reply(200, productModelsMock.getDraft);

    const productModel = await productModelsApi.getDraft('code123');

    expect(productModel).toEqual(productModelsMock.getDraft);
    expect(productModel.code).toBe('code123');
  });

  it('should submit a draft for approval', async () => {
    nock(baseUrl).post('/api/rest/v1/product-models/code123/proposal').reply(204);

    await productModelsApi.submitDraftForApproval('code123');
  });

  it('should update or create multiple products', async () => {
    const products: UpdateProductModelRequest[] = [
      {
        code: 'code1',
        values: { name: [{ locale: null, scope: null, data: 'Product 1' }] },
      },
      {
        code: 'code2',
        values: { name: [{ locale: null, scope: null, data: 'Product 2' }] },
      },
    ];

    nock(baseUrl).patch('/api/rest/v1/product-models').reply(200, productModelsMock.updateCreateSeveral);

    const result = await productModelsApi.updateOrCreateSeveral(products);

    expect(result).toHaveLength(2);
    expect(result[0].code).toBe('code1');
    expect(result[0].status_code).toBe(201);
    expect(result[1].code).toBe('code2');
  });

  it('should handle API authentication process', async () => {
    nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
      expires_in: 3600,
    });

    nock(baseUrl)
      .get('/api/rest/v1/product-models/test_product_123/draft')
      .matchHeader('Authorization', 'Bearer new_access_token')
      .reply(200, productModelsMock.getDraft);

    const product = await productModelsApi.getDraft('test_product_123');

    expect(product).toEqual(productModelsMock.getDraft);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).get('/api/rest/v1/product-models/nonexistent_product/draft').reply(404, {
      code: 404,
      message: 'Product "nonexistent_product" does not exist.',
    });

    await expect(productModelsApi.getDraft('nonexistent_product')).rejects.toThrow();
  });
});
