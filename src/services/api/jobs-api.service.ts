import { AkeneoApiClient } from '../akeneo-api-client';

export type LaunchJobResponse = {
  execution_id: string;
};

export type LaunchImportJobOptions = {
  import_mode?: 'create_only' | 'update_only' | 'create_or_update';
};

export class JobsApi {
  private readonly endpoint = '/api/rest/v1/jobs';

  constructor(private readonly client: AkeneoApiClient) {}

  async launchExportJob(code: string): Promise<LaunchJobResponse> {
    return this.client.httpClient.post(`${this.endpoint}/export/${code}`, {}).then((response) => response.data);
  }

  async launchImportJob(code: string, options: LaunchImportJobOptions = {}): Promise<LaunchJobResponse> {
    return this.client.httpClient.post(`${this.endpoint}/import/${code}`, options).then((response) => response.data);
  }
}
