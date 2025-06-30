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
  with_count?: boolean;
  with_attribute_options?: boolean;
  with_asset_share_links?: boolean;
  with_quality_scores?: boolean;
};

export type ProductModelsGetParams = {
  with_asset_share_links?: boolean;
  with_quality_scores?: boolean;
};

export type CreateProductModelRequest = Partial<
  Omit<ProductModelType, 'created' | 'updated' | 'metadata' | 'quality_scores' | 'family_variant' | 'family'>
> &
  Required<Pick<ProductModelType, 'family_variant' | 'family'>>;

export type UpdateProductModelRequest = Partial<
  Omit<ProductModelType, 'created' | 'updated' | 'metadata' | 'quality_scores'>
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

  public async updateOrCreateSeveral(
    data: UpdateProductModelRequest[],
  ): Promise<SeveralProductModelsUpdateOrCreationResponseLine[]> {
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

  public async submitDraftForApproval(identifier: string): Promise<void> {
    await this.client.httpClient.post(`${this.endpoint}/${identifier}/proposal`, {});
  }

  public async getDraft(identifier: string): Promise<ProductModelType> {
    return this.client.httpClient.get(`${this.endpoint}/${identifier}/draft`).then((response) => response.data);
  }
}
