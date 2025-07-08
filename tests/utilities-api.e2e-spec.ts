import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('UtilitiesApi E2E', () => {
  let akeneoClient: AkeneoClient;

  beforeAll(() => {
    akeneoClient = setupAkeneoClient();
  });

  beforeEach(() => {
    setupNock();
  });

  afterAll(() => {
    teardownNock();
  });

  it('should fetch system information', async () => {
    const mockInfo = { version: '7.0', edition: 'CE' };
    nock(baseUrl).get('/api/rest/v1/system-information').reply(200, mockInfo);

    const result = await akeneoClient.utilities.getSystemInformation();
    expect(result).toEqual(mockInfo);
  });

  it('should handle errors when fetching system information', async () => {
    nock(baseUrl).get('/api/rest/v1/system-information').reply(500, { message: 'API error' });

    await expect(akeneoClient.utilities.getSystemInformation()).rejects.toThrow();
  });
});
