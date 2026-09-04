import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, Readiness } from '../../types';

export type ReadinessSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
  codes?: string;
  is_draft?: boolean;
};

export type CreateOrUpdateReadinessRequest = Omit<Readiness, 'code' | 'created_at' | 'updated_at'> & {
  code?: string;
};

export class ReadinessApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/readiness';
  }

  async list(params?: ReadinessSearchParams): Promise<PaginatedResponse<Readiness>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async get(code: string): Promise<Readiness> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  async createOrUpdate(code: string, data: CreateOrUpdateReadinessRequest): Promise<void> {
    await this.client.httpClient.put(`${this.endpoint}/${code}`, data);
  }

  async delete(code: string): Promise<void> {
    await this.client.httpClient.delete(`${this.endpoint}/${code}`);
  }
}
