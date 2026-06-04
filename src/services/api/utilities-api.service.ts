import { AkeneoApiClient } from '../akeneo-api-client';

export type SystemInfo = {
  version: string;
  edition: string;
};

export type ApiEndpointRoute = {
  route?: string;
  methods?: string[];
};

export type ApiEndpointsList = {
  host?: string;
  authentication?: { [key: string]: ApiEndpointRoute };
  routes?: { [key: string]: ApiEndpointRoute };
};

export class UtilitiesApi {
  constructor(private client: AkeneoApiClient) {}

  public async getSystemInformation(): Promise<SystemInfo> {
    return this.client.httpClient.get('/api/rest/v1/system-information').then((response) => response.data);
  }

  public async listEndpoints(): Promise<ApiEndpointsList> {
    return this.client.httpClient.get('/api/rest/v1').then((response) => response.data);
  }
}
