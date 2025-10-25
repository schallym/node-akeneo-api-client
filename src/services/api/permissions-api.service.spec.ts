import { PermissionsApi } from './permissions-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { ChannelPermissions, LocalePermissions } from '../../types';

describe('PermissionsApi', () => {
  let permissionsApi: PermissionsApi;
  let mockClient: AkeneoApiClient;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
    };

    mockClient = {
      httpClient: mockHttpClient,
    } as AkeneoApiClient;

    permissionsApi = new PermissionsApi(mockClient);
  });

  describe('getUserLocalePermissions', () => {
    it('should fetch user locale permissions', async () => {
      const userUuid = 'user-123';
      const mockLocalePermissions: LocalePermissions = {
        userUuid: userUuid,
        locales: {
          en_US: { canView: true, canEdit: true },
          fr_FR: { canView: true, canEdit: false },
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockLocalePermissions });

      const result = await permissionsApi.getUserLocalePermissions(userUuid);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/permissions/user-123/locales');
      expect(result).toEqual(mockLocalePermissions);
    });
  });

  describe('getUserChannelPermissions', () => {
    it('should fetch user channel permissions', async () => {
      const userUuid = 'user-123';
      const mockChannelPermissions: ChannelPermissions = {
        userUuid: userUuid,
        channels: {
          ecommerce: { canView: true, canEdit: true },
          mobile: { canView: true, canEdit: false },
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockChannelPermissions });

      const result = await permissionsApi.getUserChannelPermissions(userUuid);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/permissions/user-123/channels');
      expect(result).toEqual(mockChannelPermissions);
    });
  });
});
