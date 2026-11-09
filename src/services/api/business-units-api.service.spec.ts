import { BusinessUnitsApi, CreateOrUpdateBusinessUnitRequest } from './business-units-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { BusinessUnit } from '../../types';

describe('BusinessUnitsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  const mockBusinessUnit: BusinessUnit = {
    uuid: '019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b',
    code: 'ziggy_wear',
    labels: { en_US: 'Ziggy Wear', fr_FR: 'Ziggy Wear' },
    groups: ['Sales', 'Marketing'],
    roles: ['ROLE_USER', 'ROLE_CATALOG_MANAGER'],
    created_at: '2026-11-04T09:30:00+00:00',
    updated_at: null,
  };

  let api: BusinessUnitsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new BusinessUnitsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('list', () => {
    it('should fetch the list of business units', async () => {
      mockHttpClient.get.mockResolvedValue({ data: [mockBusinessUnit] });

      const result = await api.list();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/business-units');
      expect(result).toEqual([mockBusinessUnit]);
    });

    it('should handle errors when listing business units', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });

  describe('createOrUpdate', () => {
    it('should create or update a business unit', async () => {
      const data: CreateOrUpdateBusinessUnitRequest = {
        code: 'ziggy_wear',
        labels: { en_US: 'Ziggy Wear', fr_FR: null },
        groups: ['Sales'],
        roles: [],
      };
      mockHttpClient.post.mockResolvedValue({ data: mockBusinessUnit });

      const result = await api.createOrUpdate(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/business-units', data);
      expect(result).toEqual(mockBusinessUnit);
    });

    it('should handle errors when creating or updating a business unit', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Validation failed.'));

      await expect(api.createOrUpdate({ code: 'bad code' })).rejects.toThrow('Validation failed.');
    });
  });
});
