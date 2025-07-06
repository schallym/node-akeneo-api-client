import { AkeneoApiClient } from '../';
import { Channel } from '../../types';
import { BaseApi } from './base-api.service';

export type ChannelsSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type CreateChannelRequest = Partial<Omit<Channel, 'code' | 'category_tree' | 'locales' | 'currencies'>> &
  Required<Pick<Channel, 'code' | 'category_tree' | 'locales' | 'currencies'>>;

export type SeveralChannelsUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export class ChannelsApi extends BaseApi<Channel, null, ChannelsSearchParams, CreateChannelRequest, Partial<Channel>> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/association-types');
  }

  async delete(): Promise<void> {
    throw new Error('Method not implemented. Deletion of association types is not supported by the API.');
  }

  async updateOrCreateSeveral(data: Partial<Channel>[]): Promise<SeveralChannelsUpdateOrCreationResponseLine[]> {
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
