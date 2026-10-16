import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, User } from '../../types';

export type UsersSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export class UsersApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/users';
  }

  async get(uuid: string): Promise<User> {
    return this.client.httpClient.get(`${this.endpoint}/${uuid}`).then((response) => response.data);
  }

  async list(params?: UsersSearchParams): Promise<PaginatedResponse<User>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }
}
