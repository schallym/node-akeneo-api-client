// tests/asset-families.e2e-spec.ts
import nock from 'nock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import assetManagerMock from './mocks/asset-manager.mock';

describe('AssetFamiliesApi E2E', () => {
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

  it('should fetch an asset family by code', async () => {
    nock(baseUrl).get('/api/rest/v1/asset-families/model_pictures').reply(200, assetManagerMock.get);

    const result = await akeneoClient.assetFamilies.get('model_pictures');
    expect(result).toEqual(assetManagerMock.get);
  });

  it('should handle errors when fetching an asset family', async () => {
    nock(baseUrl).get('/api/rest/v1/asset-families/bad').reply(404, { message: 'Not found' });

    await expect(akeneoClient.assetFamilies.get('bad')).rejects.toThrow();
  });

  it('should fetch a paginated list of asset families', async () => {
    nock(baseUrl).get('/api/rest/v1/asset-families').query({ search_after: 'abc' }).reply(200, assetManagerMock.list);

    const result = await akeneoClient.assetFamilies.list({ search_after: 'abc' });
    expect(result).toEqual(assetManagerMock.list);
  });

  it('should handle errors when listing asset families', async () => {
    nock(baseUrl).get('/api/rest/v1/asset-families').reply(500, { message: 'API error' });

    await expect(akeneoClient.assetFamilies.list()).rejects.toThrow();
  });

  it('should update or create an asset family', async () => {
    nock(baseUrl).patch('/api/rest/v1/asset-families/model_pictures', assetManagerMock.get).reply(200);

    await expect(akeneoClient.assetFamilies.updateOrCreate(assetManagerMock.get)).resolves.toBeUndefined();
  });

  it('should handle API errors when updating or creating an asset family', async () => {
    nock(baseUrl).patch('/api/rest/v1/asset-families/bad').reply(400, { message: 'Bad request' });

    await expect(akeneoClient.assetFamilies.updateOrCreate({ code: 'bad' })).rejects.toThrow();
  });
});
