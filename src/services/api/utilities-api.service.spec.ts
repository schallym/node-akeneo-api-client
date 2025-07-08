import { SystemInfo, UtilitiesApi } from './utilities-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';

describe('UtilitiesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: UtilitiesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new UtilitiesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('getSystemInformation', () => {
    it('should fetch system information', async () => {
      const mockInfo: SystemInfo = { version: '7.0', edition: 'CE' };
      mockHttpClient.get.mockResolvedValue({ data: mockInfo });

      const result = await api.getSystemInformation();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/system-information');
      expect(result).toEqual(mockInfo);
    });

    it('should handle errors when fetching system information', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.getSystemInformation()).rejects.toThrow('API error');
    });
  });
});
