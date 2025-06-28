import AkeneoClient from './akeneo-client';
import { createClient } from './index';

jest.mock('./akeneo-client');

describe('createClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a client with connection config', () => {
    const connectionConfig = {
      baseUrl: 'https://akeneo.test',
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    };

    const client = createClient(connectionConfig);

    expect(AkeneoClient).toHaveBeenCalledTimes(1);
    expect(AkeneoClient).toHaveBeenCalledWith(connectionConfig, undefined);
    expect(client).toBeDefined();
  });

  it('should create a client with app config', () => {
    const appConfig = {
      baseUrl: 'https://akeneo.test',
      accessToken: 'access_token',
      clientId: 'client_id',
    };

    const client = createClient(appConfig);

    expect(AkeneoClient).toHaveBeenCalledTimes(1);
    expect(AkeneoClient).toHaveBeenCalledWith(appConfig, undefined);
    expect(client).toBeDefined();
  });

  it('should pass axios options to client', () => {
    const connectionConfig = {
      baseUrl: 'https://akeneo.test',
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    };
    const axiosOptions = {
      timeout: 5000,
      headers: { 'Custom-Header': 'value' },
    };

    const client = createClient(connectionConfig, axiosOptions);

    expect(AkeneoClient).toHaveBeenCalledTimes(1);
    expect(AkeneoClient).toHaveBeenCalledWith(connectionConfig, axiosOptions);
    expect(client).toBeDefined();
  });
});
