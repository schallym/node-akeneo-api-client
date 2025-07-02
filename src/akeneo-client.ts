import {
  AssociationTypesApi,
  AttributeGroupsApi,
  AttributesApi,
  CategoriesApi,
  ChannelsApi,
  FamiliesApi,
  JobsApi,
  LocalesApi,
  ProductMediaFilesApi,
  ProductModelsApi,
  ProductsApi,
  ProductsUuidApi,
} from './services/api';
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
  public readonly jobs: JobsApi;
  public readonly families: FamiliesApi;
  public readonly attributes: AttributesApi;
  public readonly attributeGroups: AttributeGroupsApi;
  public readonly associationTypes: AssociationTypesApi;
  public readonly categories: CategoriesApi;
  public readonly channels: ChannelsApi;
  public readonly locales: LocalesApi;

  constructor(config: AkeneoAuthConnectionConfig | AkeneoAuthAppConfig, axiosOption?: AxiosRequestConfig) {
    this.apiClient = new AkeneoApiClient(config, axiosOption);
    this.httpClient = this.apiClient.httpClient;

    // Initialize all api services
    this.products = new ProductsApi(this.apiClient);
    this.productsUuid = new ProductsUuidApi(this.apiClient);
    this.productModels = new ProductModelsApi(this.apiClient);
    this.productMediaFiles = new ProductMediaFilesApi(this.apiClient);
    this.jobs = new JobsApi(this.apiClient);
    this.families = new FamiliesApi(this.apiClient);
    this.attributes = new AttributesApi(this.apiClient);
    this.attributeGroups = new AttributeGroupsApi(this.apiClient);
    this.associationTypes = new AssociationTypesApi(this.apiClient);
    this.categories = new CategoriesApi(this.apiClient);
    this.channels = new ChannelsApi(this.apiClient);
    this.locales = new LocalesApi(this.apiClient);
  }
}
