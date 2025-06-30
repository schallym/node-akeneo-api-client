import { AkeneoApiClient } from '../';
import { Family, VariantFamily } from '../../types';
import { BaseApi } from './base-api.service';

export type FamiliesSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type CreateFamilyRequest = Partial<Omit<Family, 'code'>> & Required<Pick<Family, 'code'>>;

export type CreateVariantFamilyRequest = Partial<Omit<VariantFamily, 'code' | 'variant_attribute_sets'>> &
  Required<Pick<VariantFamily, 'code' | 'variant_attribute_sets'>>;

export type SeveralFamiliesUpdateOrCreationResponseLine = {
  code: number;
  attributes: string[];
};

export class FamiliesApi extends BaseApi<Family, null, FamiliesSearchParams, CreateFamilyRequest, Partial<Family>> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/families');
  }

  public async updateOrCreateSeveral(data: Partial<Family>[]): Promise<SeveralFamiliesUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}`, data.map((item) => JSON.stringify(item)).join('\n'), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      })
      .then((response) => {
        return response.data
          .trim()
          .split('\n')
          .map((line: string) => JSON.parse(line));
      });
  }

  public async createVariantFamily(familyCode: string, data: CreateVariantFamilyRequest): Promise<void> {
    await this.client.httpClient.post(`${this.endpoint}/${familyCode}/variants`, data);
  }
}
