import nock from 'nock';
import AkeneoApiClient from '../src/services/akeneo-api-client';
import productsUuidMock from './mocks/products-uuid.mock';
import { ProductUuid } from '../src/types';
import { ProductsUuidApi } from '../src/services/api/product-uuid-api.service';

describe('Products UUID API E2E Tests', () => {
  const baseUrl = 'https://akeneo.test';
  let akeneoClient: AkeneoApiClient;
  let productUuidApi: ProductsUuidApi;

  beforeAll(() => {
    akeneoClient = new AkeneoApiClient({
      baseUrl,
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    });

    productUuidApi = new ProductsUuidApi(akeneoClient);
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
    nock(baseUrl).get('/api/rest/v1/products-uuid/1234-5678-9012/draft').reply(200, productsUuidMock.getDraft);

    const product = await productUuidApi.getDraft('1234-5678-9012');

    expect(product).toEqual(productsUuidMock.getDraft);
    expect(product.uuid).toBe('1234-5678-9012');
  });

  it('should submit a draft for approval', async () => {
    nock(baseUrl).post('/api/rest/v1/products-uuid/1234-5678-9012/proposal').reply(204);

    await productUuidApi.submitDraftForApproval('1234-5678-9012');
  });

  it('should update or create multiple products', async () => {
    const products: Partial<ProductUuid>[] = [
      {
        uuid: 'prod1',
        values: { name: [{ locale: null, scope: null, data: 'Product 1' }] },
      },
      {
        uuid: 'prod2',
        values: { name: [{ locale: null, scope: null, data: 'Product 2' }] },
      },
    ];

    nock(baseUrl).patch('/api/rest/v1/products-uuid').reply(200, productsUuidMock.updateCreateSeveral);

    const result = await productUuidApi.updateOrCreateSeveral(products);

    expect(result).toHaveLength(2);
    expect(result[0].uuid).toBe('prod1');
    expect(result[0].status_code).toBe(201);
    expect(result[1].uuid).toBe('prod2');
  });

  it('should handle API authentication process', async () => {
    nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
      expires_in: 3600,
    });

    nock(baseUrl)
      .get('/api/rest/v1/products-uuid/1234-5678-9012/draft')
      .matchHeader('Authorization', 'Bearer new_access_token')
      .reply(200, productsUuidMock.getDraft);

    const product = await productUuidApi.getDraft('1234-5678-9012');

    expect(product).toEqual(productsUuidMock.getDraft);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).get('/api/rest/v1/products-uuid/nonexistent_product/draft').reply(404, {
      code: 404,
      message: 'Product "nonexistent_product" does not exist.',
    });

    await expect(productUuidApi.getDraft('nonexistent_product')).rejects.toThrow();
  });
});
