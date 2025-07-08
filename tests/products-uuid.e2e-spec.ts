import nock from 'nock';
import productsUuidMock from './mocks/products-uuid.mock';
import { UpdateProductUuidRequest } from '../src/services/api';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('Products UUID API E2E Tests', () => {
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
    nock(baseUrl).get('/api/rest/v1/products-uuid/1234-5678-9012/draft').reply(200, productsUuidMock.getDraft);

    const product = await akeneoClient.productsUuid.getDraft('1234-5678-9012');

    expect(product).toEqual(productsUuidMock.getDraft);
    expect(product.uuid).toBe('1234-5678-9012');
  });

  it('should submit a draft for approval', async () => {
    nock(baseUrl).post('/api/rest/v1/products-uuid/1234-5678-9012/proposal').reply(204);

    await akeneoClient.productsUuid.submitDraftForApproval('1234-5678-9012');
  });

  it('should update or create multiple products', async () => {
    const products: UpdateProductUuidRequest[] = [
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

    const result = await akeneoClient.productsUuid.updateOrCreateSeveral(products);

    expect(result).toHaveLength(2);
    expect(result[0].uuid).toBe('prod1');
    expect(result[0].status_code).toBe(201);
    expect(result[1].uuid).toBe('prod2');
  });

  it('should handle API authentication process', async () => {
    nock(baseUrl)
      .get('/api/rest/v1/products-uuid/1234-5678-9012/draft')
      .matchHeader('Authorization', 'Bearer new_access_token')
      .reply(200, productsUuidMock.getDraft);

    const product = await akeneoClient.productsUuid.getDraft('1234-5678-9012');

    expect(product).toEqual(productsUuidMock.getDraft);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).get('/api/rest/v1/products-uuid/nonexistent_product/draft').reply(404, {
      code: 404,
      message: 'Product "nonexistent_product" does not exist.',
    });

    await expect(akeneoClient.productsUuid.getDraft('nonexistent_product')).rejects.toThrow();
  });
});
