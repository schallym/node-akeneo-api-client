import { AkeneoApiClient } from '../';
import { PaginatedResponse, ProductUuid } from '../../types';
import { BaseApi } from './base-api.service';
import { ProductsGetParams, ProductsSearchParams } from './products-api.service';

export type ProductsUuidSearchQueryParams = {
  pagination_type?: 'page' | 'search_after';
  page?: number;
  search_after?: string;
  limit?: number;
  with_count?: boolean;
};

export type ProductsUuidSearchQuery = {
  search?: string;
  scope?: string;
  locales?: string;
  attributes?: string;
  convert_measurements?: boolean;
  with_attribute_options?: boolean;
  with_asset_share_links?: boolean;
  with_quality_scores__products?: boolean;
  with_completenesses?: boolean;
  with_workflow_execution_statuses?: boolean;
};

export type CreateProductUuidRequest = Partial<
  Omit<ProductUuid, 'created' | 'updated' | 'metadata' | 'quality_scores' | 'completenesses' | 'uuid'>
> &
  Required<Pick<ProductUuid, 'uuid'>>;

export type UpdateProductUuidRequest = Partial<
  Omit<ProductUuid, 'created' | 'updated' | 'metadata' | 'quality_scores' | 'completenesses' | 'uuid'>
> &
  Required<Pick<ProductUuid, 'uuid'>> & {
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

  async updateOrCreateSeveral(
    data: Partial<ProductUuid>[],
  ): Promise<SeveralProductsUuidUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}`, data.map((item) => JSON.stringify(item)).join('\n'), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      })
      .then((response) => {
        return (typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
          .trim()
          .split('\n')
          .map((line: string) => JSON.parse(line));
      });
  }

  async submitDraftForApproval(uuid: string): Promise<void> {
    await this.client.httpClient.post(`${this.endpoint}/${uuid}/proposal`, {});
  }

  async getDraft(uuid: string): Promise<ProductUuid> {
    return this.client.httpClient.get(`${this.endpoint}/${uuid}/draft`).then((response) => response.data);
  }

  async search(
    query?: ProductsUuidSearchQuery,
    params?: ProductsUuidSearchQueryParams,
  ): Promise<PaginatedResponse<ProductUuid>> {
    return this.client.httpClient
      .post(`${this.endpoint}/search`, query ?? {}, { params })
      .then((response) => response.data);
  }
}
