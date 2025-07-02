import nock from 'nock';
import { Channel } from '../src/types';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('ChannelsApi E2E', () => {
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

  it('should update or create several channels', async () => {
    const channels: Partial<Channel>[] = [
      { code: 'ecommerce', labels: { en_US: 'Ecommerce' } },
      { code: 'mobile', labels: { en_US: 'Mobile' } },
    ];

    const mockResponse =
      JSON.stringify({ line: 1, code: 'ecommerce', status_code: 200, message: 'ok' }) +
      '\n' +
      JSON.stringify({ line: 2, code: 'mobile', status_code: 201, message: 'created' });

    nock(baseUrl).patch('/api/rest/v1/association-types').reply(200, mockResponse);

    const result = await akeneoClient.channels.updateOrCreateSeveral(channels);

    expect(result).toEqual([
      { line: 1, code: 'ecommerce', status_code: 200, message: 'ok' },
      { line: 2, code: 'mobile', status_code: 201, message: 'created' },
    ]);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/association-types').reply(400, { code: 400, message: 'Bad request' });

    await expect(akeneoClient.channels.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });

  it('should throw when trying to delete a channel', async () => {
    await expect(akeneoClient.channels.delete()).rejects.toThrow(
      'Method not implemented. Deletion of association types is not supported by the API.',
    );
  });
});
