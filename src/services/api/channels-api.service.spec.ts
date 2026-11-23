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
        '/api/rest/v1/channels',
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

    it('should send PATCH request with correct data and parse response with non string response', async () => {
      const channels: Partial<Channel>[] = [{ code: 'ecommerce', labels: { en_US: 'Ecommerce' } }];

      const mockResponseData = { line: 1, code: 'ecommerce', status_code: 200, message: 'ok' };

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(channels);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/channels', JSON.stringify(channels[0]), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      });

      expect(result).toEqual([{ line: 1, code: 'ecommerce', status_code: 200, message: 'ok' }]);
    });

    it('should send conversion units with decimal-precision settings', async () => {
      const channels: Partial<Channel>[] = [
        {
          code: 'ecommerce',
          conversion_units: {
            weight: 'KILOGRAM',
            pim_config_family_rules: {
              Power: {
                en_US: 'KILOWATT',
                fr_FR: { unit: 'WATT', decimal_places_strategy: 'round', decimal_places: 2 },
              },
            },
            pim_config_attribute_locale_rules: { weight: { en_US: 'KILOGRAM' } },
            pim_config_attribute_default_precision: {
              weight: { decimal_places_strategy: 'round', decimal_places: 1 },
              length: { decimal_places_strategy: 'trim', decimal_places: null },
              volume: null,
            },
          },
        },
      ];

      mockHttpClient.patch.mockResolvedValue({
        data: JSON.stringify({ line: 1, code: 'ecommerce', status_code: 204 }),
      });

      const result = await api.updateOrCreateSeveral(channels);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/channels', JSON.stringify(channels[0]), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      });
      expect(result).toEqual([{ line: 1, code: 'ecommerce', status_code: 204 }]);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow('Bad request');
    });
  });

  describe('delete', () => {
    it('should throw an error when trying to delete a channel', async () => {
      await expect(api.delete()).rejects.toThrow(
        'Method not implemented. Deletion of channels is not supported by the API.',
      );
    });
  });
});
