import { AkeneoApiClient } from '../';
import { AssociationType } from '../../types';
import { BaseApi } from './base-api.service';

export type AssociationTypesSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type CreateAssociationTypeRequest = Partial<Omit<AssociationType, 'code'>> &
  Required<Pick<AssociationType, 'code'>>;

export type SeveralAssociationTypesUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export class AssociationTypesApi extends BaseApi<
  AssociationType,
  null,
  AssociationTypesSearchParams,
  CreateAssociationTypeRequest,
  Partial<AssociationType>
> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/association-types');
  }

  async delete(): Promise<void> {
    throw new Error('Method not implemented. Deletion of association types is not supported by the API.');
  }

  async updateOrCreateSeveral(
    data: Partial<AssociationType>[],
  ): Promise<SeveralAssociationTypesUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}`, data.map((item) => JSON.stringify(item)).join('\n'), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      })
      .then((response) => {
        return (typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
          .trim()
          .split('\n')
          .map((line: string) => JSON.parse(line));
      });
  }
}
