import { ProductMediaFilesApi, ProductModelsApi, ProductsApi, ProductsUuidApi } from './services/api';
import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from './types';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AkeneoApiClient } from './services';

export default class AkeneoClient {
  private readonly apiClient: AkeneoApiClient;
  public readonly httpClient: AxiosInstance;

  // API services
  public readonly products: ProductsApi;
  public readonly productsUuid: ProductsUuidApi;
  public readonly productModels: ProductModelsApi;
  public readonly productMediaFiles: ProductMediaFilesApi;

  constructor(config: AkeneoAuthConnectionConfig | AkeneoAuthAppConfig, axiosOption?: AxiosRequestConfig) {
    this.apiClient = new AkeneoApiClient(config, axiosOption);
    this.httpClient = this.apiClient.httpClient;

    // Initialize all api services
    this.products = new ProductsApi(this.apiClient);
    this.productsUuid = new ProductsUuidApi(this.apiClient);
    this.productModels = new ProductModelsApi(this.apiClient);
    this.productMediaFiles = new ProductMediaFilesApi(this.apiClient);
  }
}
