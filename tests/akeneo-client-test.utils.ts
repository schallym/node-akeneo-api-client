import nock from 'nock';
import AkeneoClient from '../src/akeneo-client';

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

  nock.cleanAll();
  nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
    access_token: 'new_access_token',
    refresh_token: 'new_refresh_token',
    expires_in: 3600,
  });
}

export function teardownNock() {
  nock.enableNetConnect();
  nock.cleanAll();
}
