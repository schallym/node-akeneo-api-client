import { ReferenceEntitiesApi } from './reference-entities-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, ReferenceEntity } from '../../types';
import {
  ReferenceEntitiesAttributesApi,
  ReferenceEntitiesMediaFilesApi,
  ReferenceEntitiesRecordsApi,
} from './reference-entities';

describe('ReferenceEntitiesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ReferenceEntitiesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ReferenceEntitiesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('constructor', () => {
    it('should initialize with correct endpoint and attributes API', () => {
      expect(api).toBeInstanceOf(ReferenceEntitiesApi);
      expect(api.attributes).toBeDefined();
      expect(api.attributes).toBeInstanceOf(ReferenceEntitiesAttributesApi);
      expect(api.records).toBeDefined();
      expect(api.records).toBeInstanceOf(ReferenceEntitiesRecordsApi);
      expect(api.mediaFiles).toBeDefined();
      expect(api.mediaFiles).toBeInstanceOf(ReferenceEntitiesMediaFilesApi);
    });
  });

  describe('get', () => {
    it('should fetch a reference entity by identifier', async () => {
      const mockEntity: ReferenceEntity = { code: 'brand', labels: { en_US: 'Brand' } };
      mockHttpClient.get.mockResolvedValue({ data: mockEntity });

      const result = await api.get('brand');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand');
      expect(result).toEqual(mockEntity);
    });

    it('should handle errors when fetching a reference entity', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of reference entities', async () => {
      const mockResponse: PaginatedResponse<ReferenceEntity> = {
        _embedded: { items: [{ code: 'brand', labels: { en_US: 'Brand' } }] },
        current_page: 2,
        _links: {
          self: { href: '/api/rest/v1/reference-entities?page=2&limit=10' },
          first: { href: '/api/rest/v1/reference-entities?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ search_after: 'abc' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities', {
        params: { search_after: 'abc' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing reference entities', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreate', () => {
    it('should send PATCH request with correct data', async () => {
      const data: ReferenceEntity = { code: 'brand', labels: { en_US: 'Brand' } };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreate(data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreate({ code: 'bad', labels: {} })).rejects.toThrow('Bad request');
    });
  });
});
