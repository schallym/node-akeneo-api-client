import { AkeneoApiClient } from '../';
import { Family, PaginatedResponse, VariantFamily } from '../../types';
import { BaseApi } from './base-api.service';

export type FamiliesSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type VariantFamiliesSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type CreateFamilyRequest = Partial<Omit<Family, 'code'>> & Required<Pick<Family, 'code'>>;

export type CreateVariantFamilyRequest = Partial<Omit<VariantFamily, 'code' | 'variant_attribute_sets'>> &
  Required<Pick<VariantFamily, 'code' | 'variant_attribute_sets'>>;

export type SeveralFamiliesUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export type SeveralVariantFamiliesUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export class FamiliesApi extends BaseApi<Family, null, FamiliesSearchParams, CreateFamilyRequest, Partial<Family>> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/families');
  }

  async updateOrCreateSeveral(data: Partial<Family>[]): Promise<SeveralFamiliesUpdateOrCreationResponseLine[]> {
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

  async listVariantFamilies(
    familyCode: string,
    params?: VariantFamiliesSearchParams,
  ): Promise<PaginatedResponse<VariantFamily>> {
    return this.client.httpClient
      .get(`${this.endpoint}/${familyCode}/variants`, { params })
      .then((response) => response.data);
  }

  async getVariantFamily(familyCode: string): Promise<VariantFamily> {
    return this.client.httpClient.get(`${this.endpoint}/${familyCode}/variants`).then((response) => response.data);
  }

  async createVariantFamily(familyCode: string, data: CreateVariantFamilyRequest): Promise<void> {
    await this.client.httpClient.post(`${this.endpoint}/${familyCode}/variants`, data);
  }

  async updateVariantFamily(familyCode: string, code: string, data: Partial<VariantFamily>): Promise<void> {
    await this.client.httpClient.patch(`${this.endpoint}/${familyCode}/variants/${code}`, data);
  }

  async updateOrCreateSeveralVariantFamilies(
    familyCode: string,
    data: Partial<VariantFamily>[],
  ): Promise<SeveralVariantFamiliesUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}/${familyCode}/variants`, data.map((item) => JSON.stringify(item)).join('\n'), {
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
}
