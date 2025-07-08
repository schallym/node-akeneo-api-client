import { BaseApi } from '../base-api.service';
import { Catalog } from '../../../types';
import { AkeneoApiClient } from '../../akeneo-api-client';

export type CatalogSearchParams = {
  limit?: number;
  page?: number;
};

export type CreateCatalogRequest = Partial<Omit<Catalog, 'name'>> & Required<Pick<Catalog, 'name'>>;

export class CatalogApi extends BaseApi<Catalog, null, CatalogSearchParams, CreateCatalogRequest, Partial<Catalog>> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/catalogs');
  }

  async duplicate(catalogId: string): Promise<Catalog> {
    return this.client.httpClient.post(`${this.endpoint}/${catalogId}/duplicate`).then((response) => response.data);
  }
}
