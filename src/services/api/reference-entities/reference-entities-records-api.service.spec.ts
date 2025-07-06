import { ReferenceEntitiesRecordsApi } from './reference-entities-records-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { PaginatedResponse, ReferenceEntityRecord } from '../../../types';

describe('ReferenceEntitiesRecordsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ReferenceEntitiesRecordsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ReferenceEntitiesRecordsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch a reference entity record by code', async () => {
      const mockRecord: ReferenceEntityRecord = { code: 'rec1', values: {}, created: '', updated: '' } as any;
      mockHttpClient.get.mockResolvedValue({ data: mockRecord });

      const result = await api.get('brand', 'rec1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/records/rec1');
      expect(result).toEqual(mockRecord);
    });

    it('should handle errors when fetching a record', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('brand', 'bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of records', async () => {
      const mockResponse: PaginatedResponse<ReferenceEntityRecord>[] = [
        {
          _embedded: { items: [{ code: 'rec1', values: {}, created: '', updated: '' }] },
          current_page: 2,
          _links: {
            self: { href: '/api/rest/v1/reference-entities/brand/records?page=2&limit=10' },
            first: { href: '/api/rest/v1/reference-entities/brand/records?limit=10' },
          },
        },
      ];
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list('brand', { search: 'foo' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/records', {
        params: { search: 'foo' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing records', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list('brand')).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreate', () => {
    it('should send PATCH request with correct data', async () => {
      const data = { code: 'rec1', values: {} };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreate('brand', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/records/rec1', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreate('brand', { code: 'bad', values: {} })).rejects.toThrow('Bad request');
    });
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and return response', async () => {
      const data = [
        { code: 'rec1', values: {} },
        { code: 'rec2', values: {} },
      ];
      const mockResponse = [
        { code: 'rec1', status_code: 200, message: 'ok' },
        { code: 'rec2', status_code: 201, message: 'created' },
      ];
      mockHttpClient.patch.mockResolvedValue({ data: mockResponse });

      const result = await api.updateOrCreateSeveral('brand', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/records', data);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateSeveral('brand', [{ code: 'bad', values: {} }])).rejects.toThrow('Bad request');
    });
  });
});
