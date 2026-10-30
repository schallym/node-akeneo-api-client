import { AkeneoApiClient } from '../../akeneo-api-client';
import { PaginatedResponse, ProductProposal } from '../../../types';

export type ProductProposalsSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export class ProductProposalsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/product-proposals';
  }

  async get(uuid: string, author: string): Promise<ProductProposal> {
    return this.client.httpClient.get(`${this.endpoint}/${uuid}/${author}`).then((response) => response.data);
  }

  async list(params?: ProductProposalsSearchParams): Promise<PaginatedResponse<ProductProposal>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async delete(uuid: string, author: string): Promise<void> {
    await this.client.httpClient.delete(`${this.endpoint}/${uuid}/${author}`);
  }
}
