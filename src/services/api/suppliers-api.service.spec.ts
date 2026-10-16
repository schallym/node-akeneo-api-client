import { CreateSupplierRequest, SuppliersApi } from './suppliers-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, Supplier } from '../../types';
import { SupplierUsersApi } from './suppliers';

describe('SuppliersApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  const mockSupplier: Supplier = {
    code: 'ERP-4471',
    name: 'Acme Corp',
    portal_uuid: '3f8a1b2c-4d5e-4f60-8a7b-9c0d1e2f3a4b',
    default_channel_code: 'ecommerce',
    default_locale_code: 'en_US',
    avatar_file_key: null,
  };

  let api: SuppliersApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new SuppliersApi(mockClient as unknown as AkeneoApiClient);
  });

  it('should expose the supplier users sub-resource', () => {
    expect(api.users).toBeInstanceOf(SupplierUsersApi);
  });

  describe('get', () => {
    it('should fetch a supplier by code', async () => {
      mockHttpClient.get.mockResolvedValue({ data: mockSupplier });

      const result = await api.get('ERP-4471');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/suppliers/ERP-4471');
      expect(result).toEqual(mockSupplier);
    });

    it('should handle errors when fetching a supplier', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of suppliers', async () => {
      const mockResponse: PaginatedResponse<Supplier> = {
        _embedded: { items: [mockSupplier] },
        current_page: 1,
        _links: {
          self: { href: '/api/rest/v1/suppliers?page=1&limit=10' },
          first: { href: '/api/rest/v1/suppliers?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ page: 1, limit: 10 });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/suppliers', {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing suppliers', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });

  describe('create', () => {
    it('should send POST request and return the created supplier code', async () => {
      const data: CreateSupplierRequest = {
        code: 'ERP-4471',
        name: 'Acme Corp',
        portal_uuid: '3f8a1b2c-4d5e-4f60-8a7b-9c0d1e2f3a4b',
        default_channel_code: 'ecommerce',
        default_locale_code: 'en_US',
      };
      mockHttpClient.post.mockResolvedValue({ data: { code: 'ERP-4471' } });

      const result = await api.create(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/suppliers', data);
      expect(result).toEqual({ code: 'ERP-4471' });
    });

    it('should handle errors when creating a supplier', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Unprocessable'));

      await expect(api.create({} as CreateSupplierRequest)).rejects.toThrow('Unprocessable');
    });
  });
});
