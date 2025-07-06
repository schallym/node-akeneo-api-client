import { AkeneoApiClient } from '../akeneo-api-client';
import { Currency, PaginatedResponse } from '../../types';

export type CurrenciesSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export class CurrenciesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/currencies';
  }

  async get(code: string): Promise<Currency> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  async list(params?: CurrenciesSearchParams): Promise<PaginatedResponse<Currency>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }
}
