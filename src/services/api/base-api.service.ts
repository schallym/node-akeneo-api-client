import { AkeneoApiClient } from '../';
import { PaginatedResponse } from '../../types';

export abstract class BaseApi<ApiEntityType, GetParamsType, SearchParamsType, CreateRequestType, UpdateRequestType> {
  protected constructor(protected readonly client: AkeneoApiClient, protected readonly endpoint: string) {}

  public async get(identifier: string, params?: GetParamsType): Promise<ApiEntityType> {
    return this.client.httpClient.get(`${this.endpoint}/${identifier}`, { params }).then((response) => response.data);
  }

  public async list(params?: SearchParamsType): Promise<PaginatedResponse<ApiEntityType>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  public async create(data: CreateRequestType): Promise<void> {
    await this.client.httpClient.post(this.endpoint, data);
  }

  public async update(identifier: string, data: UpdateRequestType): Promise<void> {
    await this.client.httpClient.patch(`${this.endpoint}/${identifier}`, data);
  }

  public async delete(identifier: string): Promise<void> {
    await this.client.httpClient.delete(`${this.endpoint}/${identifier}`);
  }
}
