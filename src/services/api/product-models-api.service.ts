import { AkeneoApiClient } from '../akeneo-api-client';
import { ProductModelType } from '../../types';
import { BaseApi } from './base-api.service';

export type ProductModelsSearchParams = {
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
  with_readiness?: 'scores_only' | 'detailed';
  with_workflow_execution_statuses?: boolean;
};

export type ProductModelsGetParams = {
  with_asset_share_links?: boolean;
  with_enabled_assets_only?: boolean;
  with_quality_scores?: boolean;
  with_readiness?: 'scores_only' | 'detailed';
  with_workflow_execution_statuses?: boolean;
  scope?: string;
  convert_measurements?: boolean;
};

export type ProductModelsCreateQueryParams = {
  create_missing_options?: string;
};

export type ProductModelsUpdateQueryParams = {
  create_missing_options?: string;
};

export type CreateProductModelRequest = Partial<
  Omit<
    ProductModelType,
    | 'created'
    | 'updated'
    | 'metadata'
    | 'quality_scores'
    | 'readiness'
    | 'workflow_execution_statuses'
    | 'family_variant'
    | 'family'
  >
> &
  Required<Pick<ProductModelType, 'family_variant' | 'family'>>;

export type UpdateProductModelRequest = Partial<
  Omit<
    ProductModelType,
    'created' | 'updated' | 'metadata' | 'quality_scores' | 'readiness' | 'workflow_execution_statuses'
  >
> & {
  add_categories?: string[];
  remove_categories?: string[];
};

export type SeveralProductModelsUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export class ProductModelsApi extends BaseApi<
  ProductModelType,
  ProductModelsGetParams,
  ProductModelsSearchParams,
  CreateProductModelRequest,
  UpdateProductModelRequest
> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/product-models');
  }

  async create(data: CreateProductModelRequest, params?: ProductModelsCreateQueryParams): Promise<void> {
    await this.client.httpClient.post(this.endpoint, data, { params });
  }

  async update(code: string, data: UpdateProductModelRequest, params?: ProductModelsUpdateQueryParams): Promise<void> {
    await this.client.httpClient.patch(`${this.endpoint}/${code}`, data, { params });
  }

  async updateOrCreateSeveral(
    data: UpdateProductModelRequest[],
  ): Promise<SeveralProductModelsUpdateOrCreationResponseLine[]> {
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

  async getDraft(identifier: string): Promise<ProductModelType> {
    return this.client.httpClient.get(`${this.endpoint}/${identifier}/draft`).then((response) => response.data);
  }
}
