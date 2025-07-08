import { AkeneoApiClient } from '../akeneo-api-client';

export type SystemInfo = {
  version: string;
  edition: string;
};

export class UtilitiesApi {
  constructor(private client: AkeneoApiClient) {}

  public async getSystemInformation(): Promise<SystemInfo> {
    return this.client.httpClient.get('/api/rest/v1/system-information').then((response) => response.data);
  }
}
