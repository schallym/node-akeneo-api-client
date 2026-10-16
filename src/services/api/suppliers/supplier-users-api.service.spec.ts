import { SupplierUsersApi, UpdateOrCreateSupplierUserRequest } from './supplier-users-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { PaginatedResponse, SupplierUser } from '../../../types';

describe('SupplierUsersApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  const userUuid = '9b2e7c1a-3d4f-4a5b-8c6d-7e8f9a0b1c2d';
  const mockSupplierUser: SupplierUser = {
    uuid: userUuid,
    email: 'jane@acme.test',
    first_name: 'Jane',
    last_name: 'Doe',
    created_at: '2026-10-01T10:00:00+00:00',
    last_logged_in: null,
  };

  let api: SupplierUsersApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new SupplierUsersApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch a supplier user by uuid', async () => {
      mockHttpClient.get.mockResolvedValue({ data: mockSupplierUser });

      const result = await api.get('ERP-4471', userUuid);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/suppliers/ERP-4471/users/${userUuid}`);
      expect(result).toEqual(mockSupplierUser);
    });

    it('should handle errors when fetching a supplier user', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('ERP-4471', 'bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of supplier users', async () => {
      const mockResponse: PaginatedResponse<SupplierUser> = {
        _embedded: { items: [mockSupplierUser] },
        current_page: 1,
        _links: {
          self: { href: '/api/rest/v1/suppliers/ERP-4471/users?page=1&limit=10' },
          first: { href: '/api/rest/v1/suppliers/ERP-4471/users?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list('ERP-4471', { page: 1, limit: 10 });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/suppliers/ERP-4471/users', {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing supplier users', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list('ERP-4471')).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request and return the per-user response lines', async () => {
      const data: UpdateOrCreateSupplierUserRequest[] = [
        { email: 'jane@acme.test', first_name: 'Jane', last_name: 'Doe' },
        { email: 'invalid', first_name: 'John', last_name: 'Doe' },
      ];
      const responseLines = [
        { email: 'jane@acme.test', status_code: 201 },
        {
          email: 'invalid',
          status_code: 422,
          message: 'Validation failed.',
          errors: [{ property: 'email', message: 'This value is not a valid email address.' }],
        },
      ];
      mockHttpClient.patch.mockResolvedValue({ data: responseLines });

      const result = await api.updateOrCreateSeveral('ERP-4471', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/suppliers/ERP-4471/users', data);
      expect(result).toEqual(responseLines);
    });

    it('should handle errors when inviting supplier users', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('API error'));

      await expect(api.updateOrCreateSeveral('ERP-4471', [])).rejects.toThrow('API error');
    });
  });

  describe('delete', () => {
    it('should send DELETE request', async () => {
      mockHttpClient.delete.mockResolvedValue({});

      await api.delete('ERP-4471', userUuid);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/rest/v1/suppliers/ERP-4471/users/${userUuid}`);
    });

    it('should handle errors when revoking a supplier user', async () => {
      mockHttpClient.delete.mockRejectedValue(new Error('Not found'));

      await expect(api.delete('ERP-4471', 'bad')).rejects.toThrow('Not found');
    });
  });
});
