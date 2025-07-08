import { AkeneoApiClient } from '../../akeneo-api-client';
import { MappingSchemaForProducts } from '../../../types';

export type CreateMappingSchemaForProductsRequest = Partial<
  Omit<MappingSchemaForProducts, 'id' | '$schema' | 'properties'>
> &
  Required<Pick<MappingSchemaForProducts, '$schema' | 'properties'>>;

export class MappingSchemasApi {
  private endpoint: string;

  constructor(private client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/catalogs/{id}/mapping-schemas';
  }

  async getForProducts(catalogId: string): Promise<MappingSchemaForProducts> {
    return this.client.httpClient.get(`${this.completeEndpoint(catalogId)}/product`).then((response) => response.data);
  }

  async updateOrCreateForProducts(
    catalogId: string,
    mappingSchema: CreateMappingSchemaForProductsRequest,
  ): Promise<void> {
    await this.client.httpClient.put(`${this.completeEndpoint(catalogId)}/product`, mappingSchema);
  }

  async deleteForProducts(catalogId: string): Promise<void> {
    await this.client.httpClient.delete(`${this.completeEndpoint(catalogId)}/product`);
  }

  private completeEndpoint(catalogId: string): string {
    return this.endpoint.replace('{id}', catalogId);
  }
}
