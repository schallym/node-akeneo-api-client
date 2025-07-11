import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import httpHookMock from './mocks/http-hook.mock';

describe('HttpHooksApi E2E', () => {
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

  it('should list http hooks', async () => {
    nock(baseUrl).get('/api/rest/v1/http-hook').reply(200, httpHookMock.list);

    const result = await akeneoClient.httpHooks.list();
    expect(result).toEqual(httpHookMock.list);
  });

  it('should create or update a http hook', async () => {
    nock(baseUrl).put('/api/rest/v1/http-hook', httpHookMock.get).reply(200);

    await expect(akeneoClient.httpHooks.createOrUpdate(httpHookMock.get)).resolves.toBeUndefined();
  });

  it('should delete a http hook by type', async () => {
    nock(baseUrl).delete(`/api/rest/v1/http-hook/product.preSave`).reply(200);

    await expect(akeneoClient.httpHooks.delete(httpHookMock.get.hookType)).resolves.toBeUndefined();
  });

  it('should handle errors when listing http hooks', async () => {
    nock(baseUrl).get('/api/rest/v1/http-hook').reply(500, { message: 'API error' });

    await expect(akeneoClient.httpHooks.list()).rejects.toThrow();
  });

  it('should handle errors when creating or updating a http hook', async () => {
    nock(baseUrl).put('/api/rest/v1/http-hook', httpHookMock.get).reply(400, { message: 'Bad request' });

    await expect(akeneoClient.httpHooks.createOrUpdate(httpHookMock.get)).rejects.toThrow();
  });

  it('should handle errors when deleting a http hook', async () => {
    nock(baseUrl).delete(`/api/rest/v1/http-hook/${httpHookMock.get.hookType}`).reply(404, { message: 'Not found' });

    await expect(akeneoClient.httpHooks.delete(httpHookMock.get.hookType)).rejects.toThrow();
  });
});
