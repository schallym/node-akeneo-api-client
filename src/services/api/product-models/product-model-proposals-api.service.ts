import { AkeneoApiClient } from '../../akeneo-api-client';
import { PaginatedResponse, ProductModelProposal } from '../../../types';

export type ProductModelProposalsSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export class ProductModelProposalsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/product-model-proposals';
  }

  async get(code: string, author: string): Promise<ProductModelProposal> {
    return this.client.httpClient.get(`${this.endpoint}/${code}/${author}`).then((response) => response.data);
  }

  async list(params?: ProductModelProposalsSearchParams): Promise<PaginatedResponse<ProductModelProposal>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async delete(code: string, author: string): Promise<void> {
    await this.client.httpClient.delete(`${this.endpoint}/${code}/${author}`);
  }
}
