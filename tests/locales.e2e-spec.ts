import nock from 'nock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import localeMock from './mocks/locale.mock';

describe('LocalesApi E2E', () => {
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

  it('should fetch a locale by code', async () => {
    nock(baseUrl).get('/api/rest/v1/locales/en_US').reply(200, localeMock.get);

    const result = await akeneoClient.locales.get('en_US');
    expect(result).toEqual(localeMock.get);
  });

  it('should handle errors when fetching a locale', async () => {
    nock(baseUrl).get('/api/rest/v1/locales/bad_code').reply(404, { message: 'Not found' });

    await expect(akeneoClient.locales.get('bad_code')).rejects.toThrow();
  });

  it('should fetch a paginated list of locales', async () => {
    nock(baseUrl).get('/api/rest/v1/locales').query({ page: 1, limit: 10 }).reply(200, localeMock.list);

    const result = await akeneoClient.locales.list({ page: 1, limit: 10 });
    expect(result).toEqual(localeMock.list);
  });

  it('should handle errors when listing locales', async () => {
    nock(baseUrl).get('/api/rest/v1/locales').reply(500, { message: 'API error' });

    await expect(akeneoClient.locales.list()).rejects.toThrow();
  });
});
