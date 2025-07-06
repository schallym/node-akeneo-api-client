import { PaginatedResponse, ReferenceEntity } from '../../types';
import { AkeneoApiClient } from '../akeneo-api-client';
import {
  ReferenceEntitiesAttributesApi,
  ReferenceEntitiesMediaFilesApi,
  ReferenceEntitiesRecordsApi,
} from './reference-entities';

export type ReferenceEntitiesSearchParams = {
  search_after?: string;
};

export type UpdateOrCreateReferenceEntityRequest = Partial<Omit<ReferenceEntity, 'code'>> &
  Required<Pick<ReferenceEntity, 'code'>>;

export class ReferenceEntitiesApi {
  private readonly endpoint: string;
  readonly attributes: ReferenceEntitiesAttributesApi;
  readonly records: ReferenceEntitiesRecordsApi;
  readonly mediaFiles: ReferenceEntitiesMediaFilesApi;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/reference-entities';
    this.attributes = new ReferenceEntitiesAttributesApi(client);
    this.records = new ReferenceEntitiesRecordsApi(client);
    this.mediaFiles = new ReferenceEntitiesMediaFilesApi(client);
  }

  async get(identifier: string): Promise<ReferenceEntity> {
    return this.client.httpClient.get(`${this.endpoint}/${identifier}`).then((response) => response.data);
  }

  async list(params?: ReferenceEntitiesSearchParams): Promise<PaginatedResponse<ReferenceEntity>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async updateOrCreate(data: UpdateOrCreateReferenceEntityRequest): Promise<void> {
    await this.client.httpClient.patch(`${this.endpoint}/${data.code}`, data);
  }
}
