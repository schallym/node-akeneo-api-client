import nock from 'nock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import currencyMock from './mocks/currency.mock';

describe('CurrenciesApi E2E', () => {
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

  it('should fetch a currency by code', async () => {
    nock(baseUrl).get('/api/rest/v1/currencies/USD').reply(200, currencyMock.get);

    const result = await akeneoClient.currencies.get('USD');
    expect(result).toEqual(currencyMock.get);
  });

  it('should handle errors when fetching a currency', async () => {
    nock(baseUrl).get('/api/rest/v1/currencies/BAD').reply(404, { message: 'Not found' });

    await expect(akeneoClient.currencies.get('BAD')).rejects.toThrow();
  });

  it('should fetch a paginated list of currencies', async () => {
    nock(baseUrl).get('/api/rest/v1/currencies').query({ page: 1, limit: 10 }).reply(200, currencyMock.list);

    const result = await akeneoClient.currencies.list({ page: 1, limit: 10 });
    expect(result).toEqual(currencyMock.list);
  });

  it('should handle errors when listing currencies', async () => {
    nock(baseUrl).get('/api/rest/v1/currencies').reply(500, { message: 'API error' });

    await expect(akeneoClient.currencies.list()).rejects.toThrow();
  });
});
