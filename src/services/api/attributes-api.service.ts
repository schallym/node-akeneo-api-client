import { AkeneoApiClient } from '../';
import { Attribute, AttributeOption, PaginatedResponse } from '../../types';
import { BaseApi } from './base-api.service';

export type AttributesGetParams = {
  with_table_select_options?: boolean;
};

export type AttributesSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
  with_table_select_options?: boolean;
};

export type AttributeOptionsSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type CreateAttributeRequest = Partial<Omit<Attribute, 'code' | 'type' | 'group'>> &
  Required<Pick<Attribute, 'code' | 'type' | 'group'>>;

export type CreateAttributeOptionRequest = Partial<Omit<AttributeOption, 'code'>> & Required<Pick<Attribute, 'code'>>;

export type SeveralAttributesUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export type SeveralAttributeOptionsUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export class AttributesApi extends BaseApi<
  Attribute,
  AttributesGetParams,
  AttributesSearchParams,
  CreateAttributeRequest,
  Partial<Attribute>
> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/attributes');
  }

  async delete(): Promise<void> {
    throw new Error('Method not implemented. Deletion of attributes is not supported by the API.');
  }

  async updateOrCreateSeveral(data: Partial<Attribute>[]): Promise<SeveralAttributesUpdateOrCreationResponseLine[]> {
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

  async listAttributeOptions(
    attributeCode: string,
    params?: AttributeOptionsSearchParams,
  ): Promise<PaginatedResponse<AttributeOption>> {
    return this.client.httpClient
      .get(`${this.endpoint}/${attributeCode}/options`, { params })
      .then((response) => response.data);
  }

  async getAttributeOption(attributeCode: string, optionCode: string): Promise<AttributeOption> {
    return this.client.httpClient
      .get(`${this.endpoint}/${attributeCode}/options/${optionCode}`)
      .then((response) => response.data);
  }

  async createAttributeOption(attributeCode: string, data: CreateAttributeOptionRequest): Promise<AttributeOption> {
    return this.client.httpClient
      .post(`${this.endpoint}/${attributeCode}/options`, data)
      .then((response) => response.data);
  }

  async updateAttributeOption(
    attributeCode: string,
    optionCode: string,
    data: Partial<AttributeOption>,
  ): Promise<void> {
    await this.client.httpClient.patch(`${this.endpoint}/${attributeCode}/options/${optionCode}`, data);
  }

  async updateOrCreateSeveralAttributeOptions(
    attributeCode: string,
    data: Partial<AttributeOption>[],
  ): Promise<SeveralAttributeOptionsUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}/${attributeCode}/options`, data.map((item) => JSON.stringify(item)).join('\n'), {
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
