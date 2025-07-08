import { CatalogForAppsApi } from './catalog-for-apps-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { CatalogApi, CatalogProductsApi, MappingSchemasApi } from './catalog-for-apps';

jest.mock('./catalog-for-apps/catalogs-api.service');

describe('CatalogForAppsApi', () => {
  const mockClient = {} as AkeneoApiClient;

  beforeEach(() => {
    (CatalogApi as jest.Mock).mockClear();
  });

  it('should initialize catalogs with CatalogApi', () => {
    const api = new CatalogForAppsApi(mockClient);

    expect(api.catalogs).toBeDefined();
    expect(api.catalogs).toBeInstanceOf(CatalogApi);
    expect(api.catalogProducts).toBeDefined();
    expect(api.catalogProducts).toBeInstanceOf(CatalogProductsApi);
    expect(api.mappingSchemas).toBeDefined();
    expect(api.mappingSchemas).toBeInstanceOf(MappingSchemasApi);
  });
});
