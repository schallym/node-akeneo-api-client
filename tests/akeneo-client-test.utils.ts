import nock from 'nock';
import { AkeneoClient } from '../src';

export const baseUrl = 'https://akeneo.test';

export function setupAkeneoClient(): AkeneoClient {
  return new AkeneoClient({
    baseUrl,
    username: 'test_user',
    password: 'test_password',
    clientId: 'client_id',
    secret: 'secret',
  });
}

export function setupNock() {
  nock.disableNetConnect();
  nock.cleanAll();

  nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
    access_token: 'new_access_token',
    refresh_token: 'new_refresh_token',
    expires_in: 3600,
  });
}

export function teardownNock() {
  nock.cleanAll();
  nock.enableNetConnect();
  // nock >= 15 patches Node's core http module, which Jest shares between test files of a worker:
  // release it so the next file's nock instance can intercept requests
  nock.restore();
}
