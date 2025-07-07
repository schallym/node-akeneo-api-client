import { AkeneoApiClient } from '../../akeneo-api-client';
import { Asset, PaginatedResponse } from '../../../types';

export type AssetRecordSearchParams = {
  search?: string;
  channel?: string;
  locales?: string;
  search_after?: string;
};

export type UpdateOrCreateAssetRecordRequest = Partial<
  Omit<Asset, 'code' | 'created' | 'updated'> & {
    code: string;
  } & Required<Pick<Asset, 'code'>>
>;

export type SeveralAssetRecordsUpdateOrCreationResponseLine = {
  code: string;
  status_code: number;
  message?: string;
};

export class AssetsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/asset-families/{asset_family_code}/assets';
  }

  async get(assetFamilyCode: string, assetCode: string): Promise<Asset> {
    return this.client.httpClient.get(`${this.completeEndpoint(assetFamilyCode)}/${assetCode}`).then((response) => {
      return response.data;
    });
  }

  async list(assetFamilyCode: string, params?: AssetRecordSearchParams): Promise<PaginatedResponse<Asset>> {
    return this.client.httpClient.get(`${this.completeEndpoint(assetFamilyCode)}`, { params }).then((response) => {
      return response.data;
    });
  }

  async updateOrCreate(assetFamilyCode: string, data: UpdateOrCreateAssetRecordRequest): Promise<void> {
    await this.client.httpClient.patch(`${this.completeEndpoint(assetFamilyCode)}/${data.code}`, data);
  }

  async updateOrCreateSeveral(
    assetFamilyCode: string,
    data: UpdateOrCreateAssetRecordRequest[],
  ): Promise<SeveralAssetRecordsUpdateOrCreationResponseLine[]> {
    return this.client.httpClient.patch(`${this.completeEndpoint(assetFamilyCode)}`, data).then((response) => {
      return response.data;
    });
  }

  async delete(assetFamilyCode: string, assetCode: string): Promise<void> {
    await this.client.httpClient.delete(`${this.completeEndpoint(assetFamilyCode)}/${assetCode}`);
  }

  private completeEndpoint(assetFamilyCode: string): string {
    return this.endpoint.replace('{asset_family_code}', assetFamilyCode);
  }
}
