import { AxiosRequestConfig } from 'axios';
import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from '../types';

jest.mock('axios', () => {
  return {
    create: jest.fn(),
    post: jest.fn(),
  };
});

import AkeneoApiClient from '../services/akeneo-api-client';
import axios from 'axios';

describe('AkeneoApiClient', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: {},
    request: jest.fn(),
  };

  const mockConnectionConfig: AkeneoAuthConnectionConfig = {
    baseUrl: 'https://akeneo.test',
    username: 'test_user',
    password: 'test_password',
    clientId: 'client_id',
    secret: 'secret',
  };

  const mockAppConfig: AkeneoAuthAppConfig = {
    baseUrl: 'https://akeneo.test',
    clientId: 'client_id',
    accessToken: 'access_token',
  };

  const mockAxiosConfig: AxiosRequestConfig = {
    timeout: 5000,
    headers: { 'Custom-Header': 'value' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    (axios.post as jest.Mock).mockResolvedValue({ data: { access_token: 'new_token' } });
  });

  it('should create httpClient as AxiosInstance', () => {
    const client = new AkeneoApiClient(mockConnectionConfig);

    expect(client.httpClient).toBeDefined();
    expect(axios.create).toHaveBeenCalled();
  });

  it('should use createHttpClientFromConnection for connection config', () => {
    new AkeneoApiClient(mockConnectionConfig);

    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({ baseURL: mockConnectionConfig.baseUrl }));
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  it('should use createHttpClientFromApp for app config', () => {
    new AkeneoApiClient(mockAppConfig);

    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({ baseURL: mockAppConfig.baseUrl }));
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  it('should merge custom axios config with defaults', () => {
    new AkeneoApiClient(mockConnectionConfig, mockAxiosConfig);

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: mockConnectionConfig.baseUrl,
        timeout: mockAxiosConfig.timeout,
        headers: mockAxiosConfig.headers,
      }),
    );
  });

  it('should add auth token to request headers for connection auth', async () => {
    new AkeneoApiClient(mockConnectionConfig);

    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const mockConfig = { headers: {} };
    const result = await requestInterceptor(mockConfig);

    expect(result.headers).toHaveProperty('Authorization');
    expect(result.headers.Authorization).toMatch(/^Bearer /);
  });

  it('should add app auth headers for app-based auth', async () => {
    new AkeneoApiClient(mockAppConfig);

    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const mockConfig = { headers: {} };
    const result = await requestInterceptor(mockConfig);

    expect(result.headers).toHaveProperty('X-PIM-URL', mockAppConfig.baseUrl);
    expect(result.headers).toHaveProperty('X-PIM-TOKEN', mockAppConfig.accessToken);
    expect(result.headers).toHaveProperty('X-PIM-CLIENT-ID', mockAppConfig.clientId);
  });

  it('should refresh token on 401 responses', async () => {
    new AkeneoApiClient(mockConnectionConfig);

    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const mockError = {
      config: {
        headers: {},
        _retry: false,
      },
      response: { status: 401 },
    };
    mockAxiosInstance.request.mockResolvedValue({ data: 'response' });

    await errorHandler(mockError).catch(() => {
      /* Ignore errors during testing */
    });

    expect(axios.post).toHaveBeenCalledWith(
      `${mockConnectionConfig.baseUrl}/api/oauth/v1/token`,
      {
        grant_type: 'password',
        username: mockConnectionConfig.username,
        password: mockConnectionConfig.password,
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
        }),
      }),
    );
  });

  it('should set retry flag when refreshing token', async () => {
    new AkeneoApiClient(mockConnectionConfig);
    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

    const mockError = {
      config: {
        headers: {},
        _retry: false,
      },
      response: { status: 401 },
    };

    await errorHandler(mockError).catch(() => {
      /* Ignore errors during testing */
    });

    expect(mockError.config._retry).toBe(true);
  });
});
