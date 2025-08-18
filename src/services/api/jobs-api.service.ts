import { AkeneoApiClient } from '../akeneo-api-client';
import { JobExecution, JobExecutionSearchParams, PaginatedResponse } from '../../types';

export type LaunchJobResponse = {
  execution_id: string;
};

export type LaunchImportJobOptions = {
  import_mode?: 'create_only' | 'update_only' | 'create_or_update';
};

// Re-export types for convenience
export { JobExecution, JobExecutionSearchParams, PaginatedResponse };

export class JobsApi {
  private readonly endpoint = '/api/rest/v1/jobs';
  private readonly executionEndpoint = '/api/rest/v1/job-executions';

  constructor(private readonly client: AkeneoApiClient) {}

  async launchExportJob(code: string): Promise<LaunchJobResponse> {
    return this.client.httpClient.post(`${this.endpoint}/export/${code}`, {}).then((response) => response.data);
  }

  async launchImportJob(code: string, options: LaunchImportJobOptions = {}): Promise<LaunchJobResponse> {
    return this.client.httpClient.post(`${this.endpoint}/import/${code}`, options).then((response) => response.data);
  }

  async getJobExecution(executionId: string): Promise<JobExecution> {
    return this.client.httpClient.get(`${this.executionEndpoint}/${executionId}`).then((response) => response.data);
  }

  async listJobExecutions(params?: JobExecutionSearchParams): Promise<PaginatedResponse<JobExecution>> {
    return this.client.httpClient.get(this.executionEndpoint, { params }).then((response) => response.data);
  }

  async getJobExecutionLogs(executionId: string): Promise<string> {
    return this.client.httpClient.get(`${this.executionEndpoint}/${executionId}/logs`).then((response) => response.data);
  }
}
