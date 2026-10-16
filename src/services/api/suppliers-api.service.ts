import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, Supplier } from '../../types';
import { SupplierUsersApi } from './suppliers';

export type SuppliersSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type CreateSupplierRequest = Pick<Supplier, 'code' | 'name'> & {
  portal_uuid: string;
  default_channel_code: string;
  default_locale_code: string;
  avatar_file_key?: string | null;
};

export type CreateSupplierResponse = {
  code: string;
};

export class SuppliersApi {
  private readonly endpoint: string;
  readonly users: SupplierUsersApi;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/suppliers';
    this.users = new SupplierUsersApi(client);
  }

  async get(code: string): Promise<Supplier> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  async list(params?: SuppliersSearchParams): Promise<PaginatedResponse<Supplier>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async create(data: CreateSupplierRequest): Promise<CreateSupplierResponse> {
    return this.client.httpClient.post(this.endpoint, data).then((response) => response.data);
  }
}
