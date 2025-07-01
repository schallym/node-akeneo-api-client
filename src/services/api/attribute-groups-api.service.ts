import { AkeneoApiClient } from '../';
import { AttributeGroup } from '../../types';
import { BaseApi } from './base-api.service';

export type AttributeGroupsGetParams = {
  with_table_select_options?: boolean;
};

export type AttributeGroupsSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
  with_table_select_options?: boolean;
};

export type CreateAttributeGroupRequest = Partial<Omit<AttributeGroup, 'code'>> &
  Required<Pick<AttributeGroup, 'code'>>;

export type SeveralAttributeGroupsUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export class AttributeGroupsApi extends BaseApi<
  AttributeGroup,
  AttributeGroupsGetParams,
  AttributeGroupsSearchParams,
  CreateAttributeGroupRequest,
  Partial<AttributeGroup>
> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/attribute-groups');
  }

  public async updateOrCreateSeveral(
    data: Partial<AttributeGroup>[],
  ): Promise<SeveralAttributeGroupsUpdateOrCreationResponseLine[]> {
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
}
