import { HttpHooksApi } from './http-hooks-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { HttpHook, HttpHookFailureMode, HttpHookType } from '../../types';

describe('HttpHooksApi', () => {
  let client: AkeneoApiClient;
  let httpClient: any;
  let api: HttpHooksApi;

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    client = { httpClient } as unknown as AkeneoApiClient;
    api = new HttpHooksApi(client);
  });

  it('should list http hooks', async () => {
    const hooks: HttpHook[] = [
      {
        hookType: HttpHookType.PRODUCT_PRE_SAVE,
        failureMode: HttpHookFailureMode.ALLOW_SAVE,
        endpoint: 'https://example.com/hook1',
      },
    ];
    httpClient.get.mockResolvedValue({ data: hooks });

    const result = await api.list();

    expect(httpClient.get).toHaveBeenCalledWith('/api/rest/v1/http-hook');
    expect(result).toEqual(hooks);
  });

  it('should create or update a hook', async () => {
    const hook = { hookType: 'bar' } as any;
    httpClient.put.mockResolvedValue(undefined);

    await api.createOrUpdate(hook);

    expect(httpClient.put).toHaveBeenCalledWith('/api/rest/v1/http-hook', hook);
  });

  it('should delete a hook by type', async () => {
    httpClient.delete.mockResolvedValue(undefined);

    await api.delete('foo');

    expect(httpClient.delete).toHaveBeenCalledWith('/api/rest/v1/http-hook/foo');
  });
});
