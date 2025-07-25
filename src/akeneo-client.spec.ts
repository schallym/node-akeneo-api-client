import { AkeneoClient, HttpHooksApi } from '../src';
import { AkeneoApiClient } from './services';
import {
  AssetManagerApi,
  AssociationTypesApi,
  AttributeGroupsApi,
  AttributesApi,
  CatalogForAppsApi,
  CategoriesApi,
  ChannelsApi,
  CurrenciesApi,
  FamiliesApi,
  JobsApi,
  LocalesApi,
  MeasurementFamiliesApi,
  ProductMediaFilesApi,
  ProductModelsApi,
  ProductsApi,
  ProductsUuidApi,
  ReferenceEntitiesApi,
  UIExtensionsApi,
  UtilitiesApi,
} from './services/api';
import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from './types';
import { AxiosRequestConfig } from 'axios';

jest.mock('./services/akeneo-api-client');
jest.mock('./services/api');

describe('AkeneoClient', () => {
  const MockAkeneoApiClient = AkeneoApiClient as jest.MockedClass<typeof AkeneoApiClient>;
  const MockProductIdentifierApi = ProductsApi as jest.MockedClass<typeof ProductsApi>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with connection config', () => {
    const connectionConfig: AkeneoAuthConnectionConfig = {
      baseUrl: 'https://akeneo.test',
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    };

    const client = new AkeneoClient(connectionConfig);

    expect(MockAkeneoApiClient).toHaveBeenCalledTimes(1);
    expect(MockAkeneoApiClient).toHaveBeenCalledWith(connectionConfig, undefined);
    expect(MockProductIdentifierApi).toHaveBeenCalledTimes(1);
    expect(MockProductIdentifierApi).toHaveBeenCalledWith(expect.any(AkeneoApiClient));
    expect(client).toBeDefined();
  });

  it('should initialize with app config', () => {
    const appConfig: AkeneoAuthAppConfig = {
      baseUrl: 'https://akeneo.test',
      accessToken: 'access_token',
      clientId: 'client_id',
    };

    const client = new AkeneoClient(appConfig);

    expect(MockAkeneoApiClient).toHaveBeenCalledTimes(1);
    expect(MockAkeneoApiClient).toHaveBeenCalledWith(appConfig, undefined);
    expect(MockProductIdentifierApi).toHaveBeenCalledTimes(1);
    expect(client).toBeDefined();
  });

  it('should initialize with axios options', () => {
    const connectionConfig: AkeneoAuthConnectionConfig = {
      baseUrl: 'https://akeneo.test',
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    };
    const axiosOptions: AxiosRequestConfig = {
      timeout: 5000,
      headers: { 'Custom-Header': 'value' },
    };

    const client = new AkeneoClient(connectionConfig, axiosOptions);

    expect(MockAkeneoApiClient).toHaveBeenCalledTimes(1);
    expect(MockAkeneoApiClient).toHaveBeenCalledWith(connectionConfig, axiosOptions);
    expect(MockProductIdentifierApi).toHaveBeenCalledTimes(1);
    expect(client).toBeDefined();
  });

  it('should expose API services as properties', () => {
    const connectionConfig: AkeneoAuthConnectionConfig = {
      baseUrl: 'https://akeneo.test',
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    };

    const client = new AkeneoClient(connectionConfig);

    expect(client.products).toBeDefined();
    expect(client.products).toBeInstanceOf(ProductsApi);
    expect(client.productsUuid).toBeInstanceOf(ProductsUuidApi);
    expect(client.productModels).toBeInstanceOf(ProductModelsApi);
    expect(client.productMediaFiles).toBeInstanceOf(ProductMediaFilesApi);
    expect(client.jobs).toBeInstanceOf(JobsApi);
    expect(client.families).toBeInstanceOf(FamiliesApi);
    expect(client.attributes).toBeInstanceOf(AttributesApi);
    expect(client.attributeGroups).toBeInstanceOf(AttributeGroupsApi);
    expect(client.associationTypes).toBeInstanceOf(AssociationTypesApi);
    expect(client.categories).toBeInstanceOf(CategoriesApi);
    expect(client.channels).toBeInstanceOf(ChannelsApi);
    expect(client.locales).toBeInstanceOf(LocalesApi);
    expect(client.currencies).toBeInstanceOf(CurrenciesApi);
    expect(client.measurementFamilies).toBeInstanceOf(MeasurementFamiliesApi);
    expect(client.referenceEntities).toBeInstanceOf(ReferenceEntitiesApi);
    expect(client.assetManager).toBeInstanceOf(AssetManagerApi);
    expect(client.utilities).toBeDefined();
    expect(client.utilities).toBeInstanceOf(UtilitiesApi);
    expect(client.catalogForApps).toBeDefined();
    expect(client.catalogForApps).toBeInstanceOf(CatalogForAppsApi);
    expect(client.uiExtensions).toBeDefined();
    expect(client.uiExtensions).toBeInstanceOf(UIExtensionsApi);
    expect(client.httpHooks).toBeDefined();
    expect(client.httpHooks).toBeInstanceOf(HttpHooksApi);
  });
});
