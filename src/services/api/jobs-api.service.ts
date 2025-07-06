import { AkeneoApiClient } from '../akeneo-api-client';

export type LaunchJobResponse = {
  execution_id: string;
};

export class JobsApi {
  private readonly endpoint = '/api/rest/v1/jobs';

  constructor(private readonly client: AkeneoApiClient) {}

  async launchExportJob(code: string): Promise<LaunchJobResponse> {
    return this.client.httpClient.post(`${this.endpoint}/export/${code}`, {}).then((response) => response.data);
  }

  async launchImportJob(code: string): Promise<LaunchJobResponse> {
    return this.client.httpClient.post(`${this.endpoint}/import/${code}`, {}).then((response) => response.data);
  }
}
