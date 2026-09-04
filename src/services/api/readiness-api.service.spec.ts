import { CreateOrUpdateReadinessRequest, ReadinessApi } from './readiness-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { Readiness } from '../../types';

describe('ReadinessApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  const readiness: Readiness = {
    code: 'ecommerce_readiness',
    channels_and_locales: { ecommerce: ['en_US'] },
    product_selection_conditions: [{ field: 'family', operator: 'IN', value: ['tshirts'] }],
    requirements: [{ field: 'name', operator: 'NOT EMPTY' }],
  };

  let api: ReadinessApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ReadinessApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('list', () => {
    it('should send GET request with params and return paginated readiness configurations', async () => {
      const mockResponse = { _embedded: { items: [readiness] }, current_page: 1, _links: {} };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ codes: 'ecommerce_readiness', is_draft: false });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/readiness', {
        params: { codes: 'ecommerce_readiness', is_draft: false },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });

  describe('get', () => {
    it('should send GET request to fetch a readiness configuration by code', async () => {
      mockHttpClient.get.mockResolvedValue({ data: readiness });

      const result = await api.get('ecommerce_readiness');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/readiness/ecommerce_readiness');
      expect(result).toEqual(readiness);
    });
  });

  describe('createOrUpdate', () => {
    it('should send PUT request with the readiness configuration body', async () => {
      const data: CreateOrUpdateReadinessRequest = {
        labels: { en_US: 'Ecommerce readiness' },
        channels_and_locales: { ecommerce: ['en_US'] },
        locale_fallbacks: [{ source: 'fr_FR', target: 'en_US' }],
        product_selection_conditions: [{ field: 'family', operator: 'IN', value: ['tshirts'] }],
        selection_level: 'products_only',
        requirements: [{ field: 'name', operator: 'NOT EMPTY' }],
        is_draft: false,
      };
      mockHttpClient.put.mockResolvedValue({});

      await api.createOrUpdate('ecommerce_readiness', data);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/rest/v1/readiness/ecommerce_readiness', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.put.mockRejectedValue(new Error('Bad request'));

      await expect(
        api.createOrUpdate('bad', { channels_and_locales: {}, product_selection_conditions: [], requirements: [] }),
      ).rejects.toThrow('Bad request');
    });
  });

  describe('delete', () => {
    it('should send DELETE request to remove a readiness configuration', async () => {
      mockHttpClient.delete.mockResolvedValue({});

      await api.delete('ecommerce_readiness');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/rest/v1/readiness/ecommerce_readiness');
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.delete.mockRejectedValue(new Error('Not found'));

      await expect(api.delete('bad')).rejects.toThrow('Not found');
    });
  });
});
