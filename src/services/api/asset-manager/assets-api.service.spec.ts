import { AssetsApi, UpdateOrCreateAssetRecordRequest } from './assets-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { Asset, PaginatedResponse } from '../../../types';

describe('AssetsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: AssetsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new AssetsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch an asset by code', async () => {
      const mockAsset: Asset = { code: 'a1' } as any;
      mockHttpClient.get.mockResolvedValue({ data: mockAsset });

      const result = await api.get('family1', 'a1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/assets/a1');
      expect(result).toEqual(mockAsset);
    });

    it('should handle errors when fetching an asset', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('family1', 'bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of assets', async () => {
      const mockResponse: PaginatedResponse<Asset> = {
        _embedded: { items: [{ code: 'a1' } as Asset] },
        current_page: 2,
        _links: {
          self: { href: '/api/rest/v1/asset-families/family1/assets?page=2&limit=10' },
          first: { href: '/api/rest/v1/asset-families/family1/assets?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list('family1', { search: 'foo' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/assets', {
        params: { search: 'foo' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing assets', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list('family1')).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreate', () => {
    it('should send PATCH request with correct data', async () => {
      const data: UpdateOrCreateAssetRecordRequest = { code: 'a1' };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreate('family1', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/assets/a1', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreate('family1', { code: 'bad' })).rejects.toThrow('Bad request');
    });
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with array data and return response', async () => {
      const data: UpdateOrCreateAssetRecordRequest[] = [{ code: 'a1' }, { code: 'a2' }];
      const mockResponse = [
        { code: 'a1', status_code: 201 },
        { code: 'a2', status_code: 200 },
      ];
      mockHttpClient.patch.mockResolvedValue({ data: mockResponse });

      const result = await api.updateOrCreateSeveral('family1', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/assets', data);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Batch error'));

      await expect(api.updateOrCreateSeveral('family1', [{ code: 'bad' }])).rejects.toThrow('Batch error');
    });
  });

  describe('delete', () => {
    it('should send DELETE request for an asset', async () => {
      mockHttpClient.delete.mockResolvedValue({});

      await api.delete('family1', 'a1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/assets/a1');
    });

    it('should handle errors when deleting an asset', async () => {
      mockHttpClient.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(api.delete('family1', 'bad')).rejects.toThrow('Delete failed');
    });
  });
});
