import { JobsApi, LaunchJobResponse } from './jobs-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { JobExecution, JobExecutionSearchParams, PaginatedResponse } from '../../types';

describe('JobsApi', () => {
  const mockHttpClient = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: JobsApi;
  const testCode = 'job_123';
  const testExecutionId = 'exec_123';

  beforeEach(() => {
    jest.clearAllMocks();
    api = new JobsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('launchExportJob', () => {
    it('should call the correct endpoint and return the response', async () => {
      const mockResponse: LaunchJobResponse = { execution_id: 'exec_1' };
      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await api.launchExportJob(testCode);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/jobs/export/job_123', {});
      expect(result).toEqual(mockResponse);
    });
  });

  describe('launchImportJob', () => {
    it('should call the correct endpoint and return the response', async () => {
      const mockResponse: LaunchJobResponse = { execution_id: 'exec_2' };
      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await api.launchImportJob(testCode);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/jobs/import/job_123', {});
      expect(result).toEqual(mockResponse);
    });

    it('should call the endpoint with options if provided', async () => {
      const mockResponse: LaunchJobResponse = { execution_id: 'exec_3' };
      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await api.launchImportJob(testCode, { import_mode: 'create_or_update' });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/jobs/import/job_123', {
        import_mode: 'create_or_update',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getJobExecution', () => {
    it('should call the correct endpoint and return job execution details', async () => {
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
      mockHttpClient.get.mockResolvedValue({ data: mockJobExecution });

      const result = await api.getJobExecution(testExecutionId);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/job-executions/exec_123');
      expect(result).toEqual(mockJobExecution);
    });
  });

  describe('listJobExecutions', () => {
    it('should call the correct endpoint and return paginated job executions', async () => {
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
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.listJobExecutions();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/job-executions', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should call the endpoint with search parameters if provided', async () => {
      const searchParams: JobExecutionSearchParams = {
        type: 'export',
        status: 'COMPLETED',
        user: 'admin',
        page: 1,
        limit: 10,
        with_count: true,
      };
      const mockResponse: PaginatedResponse<JobExecution> = {
        _links: {
          self: { href: '/api/rest/v1/job-executions' },
          first: { href: '/api/rest/v1/job-executions' },
        },
        current_page: 1,
        _embedded: { items: [] },
        items_count: 0,
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.listJobExecutions(searchParams);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/job-executions', { params: searchParams });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getJobExecutionLogs', () => {
    it('should call the correct endpoint and return log content', async () => {
      const mockLogs = 'Log line 1\nLog line 2\nLog line 3';
      mockHttpClient.get.mockResolvedValue({ data: mockLogs });

      const result = await api.getJobExecutionLogs(testExecutionId);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/job-executions/exec_123/logs');
      expect(result).toEqual(mockLogs);
    });
  });
});
