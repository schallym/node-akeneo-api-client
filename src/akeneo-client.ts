import {
  AkeneoApiClient,
  AssetManagerApi,
  AssociationTypesApi,
  AttributeGroupsApi,
  AttributesApi,
  CatalogForAppsApi,
  CategoriesApi,
  ChannelsApi,
  CurrenciesApi,
  FamiliesApi,
  HttpHooksApi,
  JobsApi,
  LocalesApi,
  MeasurementFamiliesApi,
  PermissionsApi,
  ProductMediaFilesApi,
  ProductModelsApi,
  ProductsApi,
  ProductsUuidApi,
  ReferenceEntitiesApi,
  UIExtensionsApi,
  UtilitiesApi,
  WorkflowApi,
} from './services';
import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from './types';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class AkeneoClient {
  private readonly apiClient: AkeneoApiClient;
  readonly httpClient: AxiosInstance;

  // API services
  readonly products: ProductsApi;
  readonly productsUuid: ProductsUuidApi;
  readonly productModels: ProductModelsApi;
  readonly productMediaFiles: ProductMediaFilesApi;
  readonly jobs: JobsApi;
  readonly families: FamiliesApi;
  readonly attributes: AttributesApi;
  readonly attributeGroups: AttributeGroupsApi;
  readonly associationTypes: AssociationTypesApi;
  readonly categories: CategoriesApi;
  readonly channels: ChannelsApi;
  readonly locales: LocalesApi;
  readonly currencies: CurrenciesApi;
  readonly measurementFamilies: MeasurementFamiliesApi;
  readonly referenceEntities: ReferenceEntitiesApi;
  readonly assetManager: AssetManagerApi;
  readonly utilities: UtilitiesApi;
  readonly catalogForApps: CatalogForAppsApi;
  readonly uiExtensions: UIExtensionsApi;
  readonly httpHooks: HttpHooksApi;
  readonly workflows: WorkflowApi;
  readonly permissions: PermissionsApi;

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
    this.currencies = new CurrenciesApi(this.apiClient);
    this.measurementFamilies = new MeasurementFamiliesApi(this.apiClient);
    this.referenceEntities = new ReferenceEntitiesApi(this.apiClient);
    this.assetManager = new AssetManagerApi(this.apiClient);
    this.utilities = new UtilitiesApi(this.apiClient);
    this.catalogForApps = new CatalogForAppsApi(this.apiClient);
    this.uiExtensions = new UIExtensionsApi(this.apiClient);
    this.httpHooks = new HttpHooksApi(this.apiClient);
    this.workflows = new WorkflowApi(this.apiClient);
    this.permissions = new PermissionsApi(this.apiClient);
  }
}
