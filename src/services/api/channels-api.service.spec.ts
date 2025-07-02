import { ChannelsApi } from './channels-api.service';
import { AkeneoApiClient } from '../';
import { Channel } from '../../types';

describe('ChannelsApi', () => {
  const mockHttpClient = {
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ChannelsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ChannelsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const channels: Partial<Channel>[] = [
        { code: 'ecommerce', labels: { en_US: 'Ecommerce' } },
        { code: 'mobile', labels: { en_US: 'Mobile' } },
      ];

      const mockResponseData = [
        JSON.stringify({ line: 1, code: 'ecommerce', status_code: 200, message: 'ok' }),
        JSON.stringify({ line: 2, code: 'mobile', status_code: 201, message: 'created' }),
      ].join('\n');

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(channels);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/association-types',
        JSON.stringify(channels[0]) + '\n' + JSON.stringify(channels[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, code: 'ecommerce', status_code: 200, message: 'ok' },
        { line: 2, code: 'mobile', status_code: 201, message: 'created' },
      ]);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow('Bad request');
    });
  });

  describe('delete', () => {
    it('should throw an error when trying to delete a channel', async () => {
      await expect(api.delete()).rejects.toThrow(
        'Method not implemented. Deletion of association types is not supported by the API.',
      );
    });
  });
});
