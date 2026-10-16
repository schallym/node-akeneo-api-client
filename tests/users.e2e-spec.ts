import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import userMock from './mocks/user.mock';

describe('UsersApi E2E', () => {
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

  it('should fetch a user by uuid', async () => {
    nock(baseUrl).get(`/api/rest/v1/users/${userMock.get.uuid}`).reply(200, userMock.get);

    const result = await akeneoClient.users.get(userMock.get.uuid);
    expect(result).toEqual(userMock.get);
  });

  it('should handle errors when fetching a user', async () => {
    nock(baseUrl).get('/api/rest/v1/users/bad').reply(404, { message: 'Not found' });

    await expect(akeneoClient.users.get('bad')).rejects.toThrow();
  });

  it('should fetch a paginated list of users', async () => {
    nock(baseUrl)
      .get('/api/rest/v1/users')
      .query({ page: 1, limit: 10, search: '{"enabled":[{"operator":"=","value":true}]}' })
      .reply(200, userMock.list);

    const result = await akeneoClient.users.list({
      page: 1,
      limit: 10,
      search: '{"enabled":[{"operator":"=","value":true}]}',
    });
    expect(result).toEqual(userMock.list);
  });

  it('should handle errors when listing users', async () => {
    nock(baseUrl).get('/api/rest/v1/users').reply(500, { message: 'API error' });

    await expect(akeneoClient.users.list()).rejects.toThrow();
  });
});
