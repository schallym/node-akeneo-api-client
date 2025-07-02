import { AkeneoApiClient } from '../akeneo-api-client';
import { Locale, PaginatedResponse } from '../../types';

export type LocalesSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export class LocalesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/locales';
  }

  public async get(code: string): Promise<Locale> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  public async list(params?: LocalesSearchParams): Promise<PaginatedResponse<Locale>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }
}
