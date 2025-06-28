import { ProductModelsApi, ProductsApi, ProductsUuidApi } from './services/api';
import AkeneoApiClient from './services/akeneo-api-client';
import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from './types';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class AkeneoClient {
  private readonly apiClient: AkeneoApiClient;
  public readonly httpClient: AxiosInstance;

  // API services
  public readonly products: ProductsApi;
  public readonly productsUuid: ProductsUuidApi;
  public readonly productModels: ProductModelsApi;

  constructor(config: AkeneoAuthConnectionConfig | AkeneoAuthAppConfig, axiosOption?: AxiosRequestConfig) {
    this.apiClient = new AkeneoApiClient(config, axiosOption);
    this.httpClient = this.apiClient.httpClient;

    // Initialize all api services
    this.products = new ProductsApi(this.apiClient);
    this.productsUuid = new ProductsUuidApi(this.apiClient);
    this.productModels = new ProductModelsApi(this.apiClient);
  }
}
