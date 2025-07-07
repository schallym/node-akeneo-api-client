import { AssetFamiliesApi, UpdateOrCreateAssetFamilyRequest } from './asset-families-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { AssetFamily, PaginatedResponse } from '../../../types';

describe('AssetFamiliesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: AssetFamiliesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new AssetFamiliesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch an asset family by code', async () => {
      const mockAssetFamily: AssetFamily = {
        code: 'af1',
        labels: {},
        attributes: [],
        attribute_as_label: '',
        attribute_as_image: '',
        attribute_requirements: {},
      } as any;
      mockHttpClient.get.mockResolvedValue({ data: mockAssetFamily });

      const result = await api.get('af1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-families/af1');
      expect(result).toEqual(mockAssetFamily);
    });

    it('should handle errors when fetching an asset family', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of asset families', async () => {
      const mockResponse: PaginatedResponse<AssetFamily> = {
        _embedded: { items: [{ code: 'af1' } as AssetFamily] },
        current_page: 2,
        _links: {
          self: { href: '/api/rest/v1/asset-families?page=2&limit=10' },
          first: { href: '/api/rest/v1/asset-families?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ search_after: 'foo' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-families', {
        params: { search_after: 'foo' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing asset families', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreate', () => {
    it('should send PATCH request with correct data', async () => {
      const data: UpdateOrCreateAssetFamilyRequest = { code: 'af1', labels: { en_US: 'AF1' } };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreate(data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/asset-families/af1', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreate({ code: 'bad' })).rejects.toThrow('Bad request');
    });
  });
});
