import nock from 'nock';
import { JobExecution, JobExecutionSearchParams, LaunchJobResponse, PaginatedResponse } from '../src/services/api';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('JobsApi E2E', () => {
  let akeneoClient: AkeneoClient;

  beforeAll(() => {
    akeneoClient = setupAkeneoClient();
  });

  afterAll(() => {
    teardownNock();
  });

  beforeEach(() => {
    setupNock();
  });

  it('should launch an export job', async () => {
    const mockResponse: LaunchJobResponse = { execution_id: 'exec_export_1' };
    nock(baseUrl).post('/api/rest/v1/jobs/export/job_123').reply(200, mockResponse);

    const result = await akeneoClient.jobs.launchExportJob('job_123');
    expect(result).toEqual(mockResponse);
  });

  it('should launch an import job', async () => {
    const mockResponse: LaunchJobResponse = { execution_id: 'exec_import_1' };
    nock(baseUrl).post('/api/rest/v1/jobs/import/job_456').reply(200, mockResponse);

    const result = await akeneoClient.jobs.launchImportJob('job_456');
    expect(result).toEqual(mockResponse);
  });

  it('should launch an import job with options', async () => {
    const mockResponse: LaunchJobResponse = { execution_id: 'exec_import_2' };
    nock(baseUrl).post('/api/rest/v1/jobs/import/job_789', { import_mode: 'update_only' }).reply(200, mockResponse);

    const result = await akeneoClient.jobs.launchImportJob('job_789', { import_mode: 'update_only' });
    expect(result).toEqual(mockResponse);
  });

  it('should get job execution details', async () => {
    const mockJobExecution: JobExecution = {
      code: 'export_products',
      status: 'COMPLETED',
      type: 'export',
      create_time: '2024-01-01T10:00:00Z',
      updated_time: '2024-01-01T10:30:00Z',
      start_time: '2024-01-01T10:00:00Z',
      end_time: '2024-01-01T10:30:00Z',
      user: 'admin',
      summary: {
        read: 100,
        written: 95,
        error: 5,
        skip: 0,
      },
    };
    nock(baseUrl).get('/api/rest/v1/job-executions/exec_123').reply(200, mockJobExecution);

    const result = await akeneoClient.jobs.getJobExecution('exec_123');
    expect(result).toEqual(mockJobExecution);
  });

  it('should list job executions', async () => {
    const mockResponse: PaginatedResponse<JobExecution> = {
      _links: {
        self: { href: '/api/rest/v1/job-executions' },
        first: { href: '/api/rest/v1/job-executions' },
      },
      current_page: 1,
      _embedded: {
        items: [
          {
            code: 'export_products',
            status: 'COMPLETED',
            type: 'export',
            create_time: '2024-01-01T10:00:00Z',
            updated_time: '2024-01-01T10:30:00Z',
            user: 'admin',
          } as JobExecution,
          {
            code: 'import_categories',
            status: 'FAILED',
            type: 'import',
            create_time: '2024-01-01T11:00:00Z',
            updated_time: '2024-01-01T11:15:00Z',
            user: 'admin',
          } as JobExecution,
        ],
      },
      items_count: 2,
    };
    nock(baseUrl).get('/api/rest/v1/job-executions').reply(200, mockResponse);

    const result = await akeneoClient.jobs.listJobExecutions();
    expect(result).toEqual(mockResponse);
  });

  it('should list job executions with search parameters', async () => {
    const searchParams: JobExecutionSearchParams = {
      type: 'export',
      status: 'COMPLETED',
      user: 'admin',
      page: 1,
      limit: 10,
    };
    const mockResponse: PaginatedResponse<JobExecution> = {
      _links: {
        self: { href: '/api/rest/v1/job-executions' },
        first: { href: '/api/rest/v1/job-executions' },
      },
      current_page: 1,
      _embedded: {
        items: [
          {
            code: 'export_products',
            status: 'COMPLETED',
            type: 'export',
            create_time: '2024-01-01T10:00:00Z',
            updated_time: '2024-01-01T10:30:00Z',
            user: 'admin',
          } as JobExecution,
        ],
      },
      items_count: 1,
    };
    nock(baseUrl).get('/api/rest/v1/job-executions').query(searchParams).reply(200, mockResponse);

    const result = await akeneoClient.jobs.listJobExecutions(searchParams);
    expect(result).toEqual(mockResponse);
  });

  it('should get job execution logs', async () => {
    const mockLogs = 'Starting job execution...\nProcessing products...\nJob completed successfully.';
    nock(baseUrl).get('/api/rest/v1/job-executions/exec_123/logs').reply(200, mockLogs);

    const result = await akeneoClient.jobs.getJobExecutionLogs('exec_123');
    expect(result).toEqual(mockLogs);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).post('/api/rest/v1/jobs/export/nonexistent').reply(404, { code: 404, message: 'Not found' });

    await expect(akeneoClient.jobs.launchExportJob('nonexistent')).rejects.toThrow();
  });

  it('should handle job execution not found errors', async () => {
    nock(baseUrl)
      .get('/api/rest/v1/job-executions/nonexistent')
      .reply(404, { code: 404, message: 'Job execution not found' });

    await expect(akeneoClient.jobs.getJobExecution('nonexistent')).rejects.toThrow();
  });

  it('should handle job execution logs not found errors', async () => {
    nock(baseUrl)
      .get('/api/rest/v1/job-executions/nonexistent/logs')
      .reply(404, { code: 404, message: 'Job execution logs not found' });

    await expect(akeneoClient.jobs.getJobExecutionLogs('nonexistent')).rejects.toThrow();
  });
});
