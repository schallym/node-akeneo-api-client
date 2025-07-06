import { AkeneoApiClient } from '../../akeneo-api-client';
import { ReferenceEntityAttribute, ReferenceEntityAttributeOption } from '../../../types';

export type UpdateOrCreateReferenceEntityAttributeRequest = Partial<
  Omit<ReferenceEntityAttribute, 'code' | 'type'> & {
    code: string;
  } & Required<Pick<ReferenceEntityAttribute, 'code' | 'type'>>
>;

export type UpdateOrCreateReferenceEntityAttributeOptionRequest = Partial<
  Omit<ReferenceEntityAttributeOption, 'code'> & {
    code: string;
  } & Required<Pick<ReferenceEntityAttributeOption, 'code'>>
>;

export class ReferenceEntitiesAttributesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/reference-entities/{reference_entity_code}/attributes';
  }

  async get(referenceEntityCode: string, attributeCode: string): Promise<ReferenceEntityAttribute> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(referenceEntityCode)}/${attributeCode}`)
      .then((response) => {
        return response.data;
      });
  }

  async list(referenceEntityCode: string): Promise<ReferenceEntityAttribute[]> {
    return this.client.httpClient.get(`${this.completeEndpoint(referenceEntityCode)}`).then((response) => {
      return response.data;
    });
  }

  async updateOrCreate(
    referenceEntityCode: string,
    data: UpdateOrCreateReferenceEntityAttributeRequest,
  ): Promise<void> {
    return this.client.httpClient.patch(`${this.completeEndpoint(referenceEntityCode)}/${data.code}`, data);
  }

  async getAttributeOption(
    referenceEntityCode: string,
    attributeCode: string,
    optionCode: string,
  ): Promise<ReferenceEntityAttributeOption> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(referenceEntityCode)}/${attributeCode}/options/${optionCode}`)
      .then((response) => {
        return response.data;
      });
  }

  async listAttributeOptions(
    referenceEntityCode: string,
    attributeCode: string,
  ): Promise<ReferenceEntityAttributeOption[]> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(referenceEntityCode)}/${attributeCode}/options`)
      .then((response) => {
        return response.data;
      });
  }

  async updateOrCreateAttributeOption(
    referenceEntityCode: string,
    attributeCode: string,
    data: UpdateOrCreateReferenceEntityAttributeOptionRequest,
  ): Promise<void> {
    return this.client.httpClient.patch(
      `${this.completeEndpoint(referenceEntityCode)}/${attributeCode}/options/${data.code}`,
      data,
    );
  }

  private completeEndpoint(referenceEntityCode: string): string {
    return this.endpoint.replace('{reference_entity_code}', referenceEntityCode);
  }
}
