import { JobsApi, LaunchJobResponse } from './jobs-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';

describe('JobsApi', () => {
  const mockHttpClient = {
    post: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: JobsApi;
  const testCode = 'job_123';

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
  });
});
