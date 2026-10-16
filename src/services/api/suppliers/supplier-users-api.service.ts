import { AkeneoApiClient } from '../../akeneo-api-client';
import { PaginatedResponse, SupplierUser } from '../../../types';

export type SupplierUsersSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type UpdateOrCreateSupplierUserRequest = Pick<SupplierUser, 'email' | 'first_name' | 'last_name'>;

export type SeveralSupplierUsersUpdateOrCreationResponseLine = {
  email?: string;
  status_code?: number;
  message?: string;
  errors?: {
    property?: string;
    message?: string;
  }[];
};

export class SupplierUsersApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/suppliers/{code}/users';
  }

  async get(supplierCode: string, userUuid: string): Promise<SupplierUser> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(supplierCode)}/${userUuid}`)
      .then((response) => response.data);
  }

  async list(supplierCode: string, params?: SupplierUsersSearchParams): Promise<PaginatedResponse<SupplierUser>> {
    return this.client.httpClient
      .get(this.completeEndpoint(supplierCode), { params })
      .then((response) => response.data);
  }

  /** Invite or update up to 100 supplier users, identified by their email. */
  async updateOrCreateSeveral(
    supplierCode: string,
    data: UpdateOrCreateSupplierUserRequest[],
  ): Promise<SeveralSupplierUsersUpdateOrCreationResponseLine[]> {
    return this.client.httpClient.patch(this.completeEndpoint(supplierCode), data).then((response) => response.data);
  }

  /** Revoke a supplier user's access. */
  async delete(supplierCode: string, userUuid: string): Promise<void> {
    await this.client.httpClient.delete(`${this.completeEndpoint(supplierCode)}/${userUuid}`);
  }

  private completeEndpoint(supplierCode: string): string {
    return this.endpoint.replace('{code}', supplierCode);
  }
}
