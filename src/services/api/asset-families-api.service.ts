import { AssetFamily, PaginatedResponse } from '../../types';
import { AkeneoApiClient } from '../akeneo-api-client';

export type AssetFamiliesSearchParams = {
  search_after?: string;
};

export type UpdateOrCreateAssetFamilyRequest = Partial<Omit<AssetFamily, 'code'>> & Required<Pick<AssetFamily, 'code'>>;

export class AssetFamiliesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/asset-families';
  }

  async get(code: string): Promise<AssetFamily> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  async list(params?: AssetFamiliesSearchParams): Promise<PaginatedResponse<AssetFamily>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async updateOrCreate(data: UpdateOrCreateAssetFamilyRequest): Promise<void> {
    await this.client.httpClient.patch(`${this.endpoint}/${data.code}`, data);
  }
}
