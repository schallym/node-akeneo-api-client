import AkeneoApiClient from '../akeneo-api-client';
import { Product } from '../../types';
import { BaseApi } from './base-api.service';

export type ProductSearchParams = {
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
  with_completenesses?: boolean;
};

export type ProductGetParams = {
  with_attribute_options?: boolean;
  with_asset_share_links?: boolean;
  with_quality_scores?: boolean;
  with_completenesses?: boolean;
};

export type SeveralProductUpdateOrCreationResponseLine = {
  line: number;
  identifier: string;
  status_code: number;
  message: string;
};

export class ProductIdentifierApi extends BaseApi<Product, ProductGetParams, ProductSearchParams> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/products');
  }

  public async updateOrCreateSeveral(
    identifier: string,
    data: Partial<Product>[],
  ): Promise<SeveralProductUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}/${identifier}`, data.map((item) => JSON.stringify(item)).join('\n'), {
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

  public async getDraft(identifier: string): Promise<Product> {
    return this.client.httpClient.get(`${this.endpoint}/${identifier}/draft`).then((response) => response.data);
  }
}
