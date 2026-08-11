import { BaseApi } from '../base-api.service';
import { Catalog } from '../../../types';
import { AkeneoApiClient } from '../../akeneo-api-client';

export type CatalogSearchParams = {
  limit?: number;
  page?: number;
};

export type CreateCatalogRequest = Partial<Omit<Catalog, 'name'>> & Required<Pick<Catalog, 'name'>>;

export type DuplicateCatalogRequest = {
  name?: string;
  managed_currencies?: string[];
  managed_locales?: string[];
  skip_required_checks?: boolean;
  replace_mapping_locales_with?: string;
};

export class CatalogApi extends BaseApi<Catalog, null, CatalogSearchParams, CreateCatalogRequest, Partial<Catalog>> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/catalogs');
  }

  async duplicate(catalogId: string, data?: DuplicateCatalogRequest): Promise<Catalog> {
    return this.client.httpClient
      .post(`${this.endpoint}/${catalogId}/duplicate`, data ?? {})
      .then((response) => response.data);
  }
}
