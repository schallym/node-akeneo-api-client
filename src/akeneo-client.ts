import { ProductIdentifierApi } from './services/api';
import AkeneoApiClient from './services/akeneo-api-client';
import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from './types';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class AkeneoClient {
  private readonly apiClient: AkeneoApiClient;
  public readonly httpClient: AxiosInstance;

  // API services
  public readonly productWithIdentifier: ProductIdentifierApi;

  constructor(config: AkeneoAuthConnectionConfig | AkeneoAuthAppConfig, axiosOption?: AxiosRequestConfig) {
    this.apiClient = new AkeneoApiClient(config, axiosOption);
    this.httpClient = this.apiClient.httpClient;

    // Initialize all api services
    this.productWithIdentifier = new ProductIdentifierApi(this.apiClient);
  }
}
