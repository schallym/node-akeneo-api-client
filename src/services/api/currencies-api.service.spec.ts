import { CurrenciesApi } from './currencies-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { Currency, PaginatedResponse } from '../../types';

describe('CurrenciesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: CurrenciesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new CurrenciesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch a currency by code', async () => {
      const mockCurrency: Currency = { code: 'USD', enabled: true, label: 'US Dollar' };
      mockHttpClient.get.mockResolvedValue({ data: mockCurrency });

      const result = await api.get('USD');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/currencies/USD');
      expect(result).toEqual(mockCurrency);
    });

    it('should handle errors when fetching a currency', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('BAD')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of currencies', async () => {
      const mockResponse: PaginatedResponse<Currency> = {
        _embedded: { items: [{ code: 'USD', enabled: true, label: 'US Dollar' }] },
        current_page: 2,
        _links: {
          self: { href: '/api/rest/v1/currencies?page=2&limit=10' },
          first: { href: '/api/rest/v1/currencies?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ page: 2, limit: 10 });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/currencies', {
        params: { page: 2, limit: 10 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing currencies', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });
});
