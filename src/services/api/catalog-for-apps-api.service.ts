import { AkeneoApiClient } from '../akeneo-api-client';
import { CatalogApi, CatalogProductsApi, MappingSchemasApi } from './catalog-for-apps';

export class CatalogForAppsApi {
  readonly catalogs: CatalogApi;
  readonly catalogProducts: CatalogProductsApi;
  readonly mappingSchemas: MappingSchemasApi;

  constructor(private readonly client: AkeneoApiClient) {
    this.catalogs = new CatalogApi(this.client);
    this.catalogProducts = new CatalogProductsApi(this.client);
    this.mappingSchemas = new MappingSchemasApi(this.client);
  }
}
