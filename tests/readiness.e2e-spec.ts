import nock from 'nock';
import readinessMock from './mocks/readiness.mock';
import { CreateOrUpdateReadinessRequest } from '../src/services/api';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('ReadinessApi E2E', () => {
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

  it('should list readiness configurations', async () => {
    nock(baseUrl).get('/api/rest/v1/readiness').query({ is_draft: false }).reply(200, readinessMock.list);

    const result = await akeneoClient.readiness.list({ is_draft: false });
    expect(result).toEqual(readinessMock.list);
  });

  it('should get a readiness configuration by code', async () => {
    nock(baseUrl).get('/api/rest/v1/readiness/ecommerce_readiness').reply(200, readinessMock.get);

    const result = await akeneoClient.readiness.get('ecommerce_readiness');
    expect(result).toEqual(readinessMock.get);
  });

  it('should create or update a readiness configuration', async () => {
    const data: CreateOrUpdateReadinessRequest = {
      labels: { en_US: 'Ecommerce readiness' },
      channels_and_locales: { ecommerce: ['en_US'] },
      product_selection_conditions: [{ field: 'family', operator: 'IN', value: ['tshirts'] }],
      requirements: [{ field: 'name', operator: 'NOT EMPTY' }],
    };
    nock(baseUrl)
      .put('/api/rest/v1/readiness/ecommerce_readiness', (body) => !!body)
      .reply(204);

    await expect(akeneoClient.readiness.createOrUpdate('ecommerce_readiness', data)).resolves.toBeUndefined();
  });

  it('should delete a readiness configuration', async () => {
    nock(baseUrl).delete('/api/rest/v1/readiness/ecommerce_readiness').reply(204);

    await expect(akeneoClient.readiness.delete('ecommerce_readiness')).resolves.toBeUndefined();
  });

  it('should handle errors when getting a readiness configuration', async () => {
    nock(baseUrl).get('/api/rest/v1/readiness/bad').reply(404, { message: 'Not found' });

    await expect(akeneoClient.readiness.get('bad')).rejects.toThrow();
  });
});
