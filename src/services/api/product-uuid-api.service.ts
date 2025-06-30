import { AkeneoApiClient } from '../';
import { ProductUuid } from '../../types';
import { BaseApi } from './base-api.service';
import { ProductsGetParams, ProductsSearchParams } from './products-api.service';

export type CreateProductUuidRequest = Partial<
  Omit<ProductUuid, 'created' | 'updated' | 'metadata' | 'quality_scores' | 'completenesses'>
>;

export type UpdateProductUuidRequest = Partial<
  Omit<ProductUuid, 'created' | 'updated' | 'metadata' | 'quality_scores' | 'completenesses'>
> & {
  add_categories?: string[];
  remove_categories?: string[];
};

export type SeveralProductsUuidUpdateOrCreationResponseLine = {
  line: number;
  uuid: string;
  status_code: number;
  message: string;
};

export class ProductsUuidApi extends BaseApi<
  ProductUuid,
  ProductsGetParams,
  ProductsSearchParams,
  CreateProductUuidRequest,
  UpdateProductUuidRequest
> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/products-uuid');
  }

  public async updateOrCreateSeveral(
    data: Partial<ProductUuid>[],
  ): Promise<SeveralProductsUuidUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}`, data.map((item) => JSON.stringify(item)).join('\n'), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      })
      .then((response) => {
        return response.data
          .trim()
          .split('\n')
          .map((line: string) => JSON.parse(line));
      });
  }

  public async submitDraftForApproval(uuid: string): Promise<void> {
    await this.client.httpClient.post(`${this.endpoint}/${uuid}/proposal`, {});
  }

  public async getDraft(uuid: string): Promise<ProductUuid> {
    return this.client.httpClient.get(`${this.endpoint}/${uuid}/draft`).then((response) => response.data);
  }
}
