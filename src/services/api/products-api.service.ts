import { AkeneoApiClient } from '../';
import { Product } from '../../types';
import { BaseApi } from './base-api.service';

export type ProductsSearchParams = {
  search?: string;
  scope?: string;
  locales?: string;
  attributes?: string;
  pagination_type?: 'page' | 'search_after';
  page?: number;
  search_after?: string;
  limit?: number;
  search_scope?: string;
  search_locale?: string;
  convert_measurements?: boolean;
  with_count?: boolean;
  with_attribute_options?: boolean;
  with_asset_share_links?: boolean;
  with_enabled_assets_only?: boolean;
  with_quality_scores?: boolean;
  with_completenesses?: boolean;
  with_readiness?: 'scores_only' | 'detailed';
  with_workflow_execution_statuses?: boolean;
};

export type ProductsGetParams = {
  with_attribute_options?: boolean;
  with_asset_share_links?: boolean;
  with_enabled_assets_only?: boolean;
  with_quality_scores?: boolean;
  with_completenesses?: boolean;
  with_readiness?: 'scores_only' | 'detailed';
  with_workflow_execution_statuses?: boolean;
};

export type ProductsCreateQueryParams = {
  create_missing_options?: string;
};

export type ProductsUpdateQueryParams = {
  create_missing_options?: string;
  update_parent_values?: boolean;
};

export type CreateProductRequest = Partial<
  Omit<
    Product,
    | 'created'
    | 'updated'
    | 'metadata'
    | 'quality_scores'
    | 'completenesses'
    | 'readiness'
    | 'workflow_execution_statuses'
    | 'identifier'
  >
> &
  Required<Pick<Product, 'identifier'>>;

export type UpdateProductRequest = Partial<
  Omit<
    Product,
    | 'created'
    | 'updated'
    | 'metadata'
    | 'quality_scores'
    | 'completenesses'
    | 'readiness'
    | 'workflow_execution_statuses'
    | 'identifier'
  >
> &
  Required<Pick<Product, 'identifier'>> & {
    add_categories?: string[];
    remove_categories?: string[];
  };

export type SeveralProductsUpdateOrCreationResponseLine = {
  line: number;
  identifier: string;
  status_code: number;
  message: string;
};

export class ProductsApi extends BaseApi<
  Product,
  ProductsGetParams,
  ProductsSearchParams,
  CreateProductRequest,
  UpdateProductRequest
> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/products');
  }

  async create(data: CreateProductRequest, params?: ProductsCreateQueryParams): Promise<void> {
    await this.client.httpClient.post(this.endpoint, data, { params });
  }

  async update(identifier: string, data: UpdateProductRequest, params?: ProductsUpdateQueryParams): Promise<void> {
    await this.client.httpClient.patch(`${this.endpoint}/${identifier}`, data, { params });
  }

  async updateOrCreateSeveral(data: UpdateProductRequest[]): Promise<SeveralProductsUpdateOrCreationResponseLine[]> {
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

  async submitDraftForApproval(identifier: string): Promise<void> {
    await this.client.httpClient.post(`${this.endpoint}/${identifier}/proposal`, {});
  }

  async getDraft(identifier: string): Promise<Product> {
    return this.client.httpClient.get(`${this.endpoint}/${identifier}/draft`).then((response) => response.data);
  }
}
