import { AkeneoApiClient } from '../../akeneo-api-client';
import { PaginatedResponse, ReferenceEntityRecord } from '../../../types';

export type ReferenceEntityRecordSearchParams = {
  search?: string;
  channel?: string;
  locales?: string;
  search_after?: string;
};

export type UpdateOrCreateReferenceEntityRecordRequest = Partial<
  Omit<ReferenceEntityRecord, 'code' | 'created' | 'updated'> & {
    code: string;
  } & Required<Pick<ReferenceEntityRecord, 'code'>>
>;

export type SeveralReferenceEntityRecordsUpdateOrCreationResponseLine = {
  code: string;
  status_code: number;
  message?: string;
};

export class ReferenceEntitiesRecordsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/reference-entities/{reference_entity_code}/records';
  }

  async get(referenceEntityCode: string, recordCode: string): Promise<ReferenceEntityRecord> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(referenceEntityCode)}/${recordCode}`)
      .then((response) => {
        return response.data;
      });
  }

  async list(
    referenceEntityCode: string,
    params?: ReferenceEntityRecordSearchParams,
  ): Promise<PaginatedResponse<ReferenceEntityRecord>[]> {
    return this.client.httpClient.get(`${this.completeEndpoint(referenceEntityCode)}`, { params }).then((response) => {
      return response.data;
    });
  }

  async updateOrCreate(referenceEntityCode: string, data: UpdateOrCreateReferenceEntityRecordRequest): Promise<void> {
    return this.client.httpClient.patch(`${this.completeEndpoint(referenceEntityCode)}/${data.code}`, data);
  }

  async updateOrCreateSeveral(
    referenceEntityCode: string,
    data: UpdateOrCreateReferenceEntityRecordRequest[],
  ): Promise<SeveralReferenceEntityRecordsUpdateOrCreationResponseLine> {
    return this.client.httpClient.patch(`${this.completeEndpoint(referenceEntityCode)}`, data).then((response) => {
      return response.data;
    });
  }

  private completeEndpoint(referenceEntityCode: string): string {
    return this.endpoint.replace('{reference_entity_code}', referenceEntityCode);
  }
}
