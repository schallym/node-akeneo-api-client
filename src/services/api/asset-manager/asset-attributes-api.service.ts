import { AkeneoApiClient } from '../../akeneo-api-client';
import { AssetAttribute, AssetAttributeOption } from '../../../types';

export type UpdateOrCreateAssetAttributeRequest = Partial<
  Omit<AssetAttribute, 'code' | 'type'> & {
    code: string;
  } & Required<Pick<AssetAttribute, 'code' | 'type'>>
>;

export type UpdateOrCreateAssetAttributeOptionRequest = Partial<
  Omit<AssetAttributeOption, 'code'> & {
    code: string;
  } & Required<Pick<AssetAttributeOption, 'code'>>
>;

export class AssetAttributesApi {
  private readonly endpoint: string;

  constructor(private client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/asset-families/{asset_family_code}/attributes';
  }

  public async get(assetFamilyCode: string, code: string): Promise<AssetAttribute> {
    return this.client.httpClient.get(`${this.completeEndpoint(assetFamilyCode)}/${code}`).then((response) => {
      return response.data;
    });
  }

  public async list(assetFamilyCode: string): Promise<AssetAttribute[]> {
    return this.client.httpClient.get(this.completeEndpoint(assetFamilyCode)).then((response) => {
      return response.data;
    });
  }

  public async updateOrCreate(assetFamilyCode: string, data: UpdateOrCreateAssetAttributeRequest): Promise<void> {
    await this.client.httpClient.patch(`${this.completeEndpoint(assetFamilyCode)}/${data.code}`, data);
  }

  async getAttributeOption(
    assetFamilyCode: string,
    attributeCode: string,
    optionCode: string,
  ): Promise<AssetAttributeOption> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(assetFamilyCode)}/${attributeCode}/options/${optionCode}`)
      .then((response) => {
        return response.data;
      });
  }

  async listAttributeOptions(assetFamilyCode: string, attributeCode: string): Promise<AssetAttributeOption[]> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(assetFamilyCode)}/${attributeCode}/options`)
      .then((response) => {
        return response.data;
      });
  }

  async updateOrCreateAttributeOption(
    assetFamilyCode: string,
    attributeCode: string,
    data: UpdateOrCreateAssetAttributeOptionRequest,
  ): Promise<void> {
    return this.client.httpClient.patch(
      `${this.completeEndpoint(assetFamilyCode)}/${attributeCode}/options/${data.code}`,
      data,
    );
  }

  private completeEndpoint(assetFamilyCode: string): string {
    return this.endpoint.replace('{asset_family_code}', assetFamilyCode);
  }
}
