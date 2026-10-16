import { UsersApi } from './users-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, User } from '../../types';

describe('UsersApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  const mockUser: User = {
    uuid: '6d1a5c4e-0f4a-4d3c-9a43-2b1c3c1c2a10',
    email: 'julia@example.com',
    enabled: true,
    first_name: 'Julia',
    last_name: null,
    roles: ['ROLE_ADMINISTRATOR'],
    groups: ['IT support'],
  };

  let api: UsersApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new UsersApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch a user by uuid', async () => {
      mockHttpClient.get.mockResolvedValue({ data: mockUser });

      const result = await api.get(mockUser.uuid);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/users/${mockUser.uuid}`);
      expect(result).toEqual(mockUser);
    });

    it('should handle errors when fetching a user', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a paginated list of users', async () => {
      const mockResponse: PaginatedResponse<User> = {
        _embedded: { items: [mockUser] },
        current_page: 1,
        _links: {
          self: { href: '/api/rest/v1/users?page=1&limit=10' },
          first: { href: '/api/rest/v1/users?limit=10' },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ page: 1, limit: 10, with_count: true });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/users', {
        params: { page: 1, limit: 10, with_count: true },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when listing users', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });
});
