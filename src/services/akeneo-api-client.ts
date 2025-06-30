import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from '../types';

const defaultAxiosConfig = {
  insecure: false,
  retryOnError: true,
  httpAgent: false,
  httpsAgent: false,
  timeout: 300000, // 5mn
  proxy: false as const,
  basePath: '',
  adapter: undefined,
  maxContentLength: 1073741824, // 1GB
};

export class AkeneoApiClient {
  public readonly httpClient: AxiosInstance;
  private readonly axiosConfig: AxiosRequestConfig;

  constructor(
    private readonly authConfig: AkeneoAuthAppConfig | AkeneoAuthConnectionConfig,
    axiosConfig: AxiosRequestConfig = {},
  ) {
    this.axiosConfig = { ...defaultAxiosConfig, ...axiosConfig };
    this.httpClient =
      'accessToken' in authConfig ? this.createHttpClientFromApp() : this.createHttpClientFromConnection();
  }

  private createHttpClientFromConnection(): AxiosInstance {
    const authConfig = this.authConfig as AkeneoAuthConnectionConfig;
    const instance = axios.create({
      ...this.axiosConfig,
      baseURL: authConfig.baseUrl,
    }) as AxiosInstance;

    let accessToken = '';
    const base64Encoded = Buffer.from(`${authConfig.clientId}:${authConfig.secret}`).toString('base64');
    const refreshAccessToken = async () => {
      const tokenResponse = await axios.post(
        `${authConfig.baseUrl}/api/oauth/v1/token`,
        {
          grant_type: 'password',
          username: authConfig.username,
          password: authConfig.password,
        },
        {
          headers: {
            Authorization: `Basic ${base64Encoded}`,
          },
        },
      );

      accessToken = tokenResponse.data.access_token;
      return tokenResponse.data.access_token;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    instance.interceptors.request.use(async (config) => ({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken || (await refreshAccessToken())}`,
      },
    }));

    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          (error.response.status === 403 || error.response.status === 401) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          accessToken = '';
          originalRequest.headers['X-PIM-TOKEN'] = await refreshAccessToken();
          return instance(originalRequest);
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }

  private createHttpClientFromApp(): AxiosInstance {
    const authConfig = this.authConfig as AkeneoAuthAppConfig;
    const instance = axios.create({
      ...this.axiosConfig,
      baseURL: authConfig.baseUrl,
    }) as AxiosInstance;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    instance.interceptors.request.use(async (config) => ({
      ...config,
      headers: {
        ...config.headers,
        'X-PIM-URL': authConfig.baseUrl,
        'X-PIM-TOKEN': authConfig.accessToken,
        'X-PIM-CLIENT-ID': authConfig.clientId,
      },
    }));

    return instance;
  }
}
