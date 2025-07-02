import { LocalesApi } from './locales-api.service';
import { AkeneoApiClient } from '../';
import { Locale, PaginatedResponse } from '../../types';

describe('LocalesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: LocalesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new LocalesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch a locale by code', async () => {
      const mockLocale: Locale = { code: 'en_US', enabled: true };
      mockHttpClient.get.mockResolvedValue({ data: mockLocale });

      const result = await api.get('en_US');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/locales/en_US');
      expect(result).toEqual(mockLocale);
    });

    it('should handle errors when fetching a locale', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('bad_code')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of locales', async () => {
      const mockResponse: PaginatedResponse<Locale> = {
        _embedded: {
          items: [
            {
              code: 'en_US',
              enabled: true,
            },
          ],
        },
        current_page: 1,
        _links: {
          self: { href: '/api/rest/v1/locales?page=1&limit=10' },
          first: { href: '/api/rest/v1/locales?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ page: 1, limit: 10 });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/locales', {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing locales', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });
});
