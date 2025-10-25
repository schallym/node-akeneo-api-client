import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import permissionsMock from './mocks/permissions.mock';

describe('PermissionsApi E2E', () => {
  let akeneoClient: AkeneoClient;

  beforeAll(() => {
    akeneoClient = setupAkeneoClient();
  });

  afterAll(() => {
    teardownNock();
  });

  beforeEach(() => {
    setupNock();
  });

  it('should fetch user locale permissions', async () => {
    const userUuid = permissionsMock.getUserLocalePermissions.userUuid;

    nock(baseUrl)
      .get(`/api/rest/v1/permissions/${userUuid}/locales`)
      .reply(200, permissionsMock.getUserLocalePermissions.locales);

    const result = await akeneoClient.permissions.getUserLocalePermissions(userUuid);

    expect(result).toEqual(permissionsMock.getUserLocalePermissions.locales);
  });

  it('should handle errors when fetching user locale permissions', async () => {
    const userUuid = permissionsMock.getUserLocalePermissions.userUuid;

    nock(baseUrl).get(`/api/rest/v1/permissions/${userUuid}/locales`).reply(500, { message: 'API error' });

    await expect(akeneoClient.permissions.getUserLocalePermissions(userUuid)).rejects.toThrow();
  });

  it('should fetch user channel permissions', async () => {
    const userUuid = permissionsMock.getUserChannelPermissions.userUuid;

    nock(baseUrl)
      .get(`/api/rest/v1/permissions/${userUuid}/channels`)
      .reply(200, permissionsMock.getUserChannelPermissions.channels);

    const result = await akeneoClient.permissions.getUserChannelPermissions(userUuid);

    expect(result).toEqual(permissionsMock.getUserChannelPermissions.channels);
  });

  it('should handle errors when fetching user channel permissions', async () => {
    const userUuid = permissionsMock.getUserChannelPermissions.userUuid;

    nock(baseUrl).get(`/api/rest/v1/permissions/${userUuid}/channels`).reply(500, { message: 'API error' });

    await expect(akeneoClient.permissions.getUserChannelPermissions(userUuid)).rejects.toThrow();
  });
});
