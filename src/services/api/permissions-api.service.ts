import { AkeneoApiClient } from '../akeneo-api-client';
import { ChannelPermissions, LocalePermissions } from '../../types';

export class PermissionsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/permissions';
  }

  async getUserLocalePermissions(userUuid: string): Promise<LocalePermissions> {
    return this.client.httpClient.get(`${this.endpoint}/${userUuid}/locales`).then((response) => response.data);
  }

  async getUserChannelPermissions(userUuid: string): Promise<ChannelPermissions> {
    return this.client.httpClient.get(`${this.endpoint}/${userUuid}/channels`).then((response) => response.data);
  }
}
