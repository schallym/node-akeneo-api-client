import nock from 'nock';
import { LaunchJobResponse } from '../src/services/api';
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

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).post('/api/rest/v1/jobs/export/nonexistent').reply(404, { code: 404, message: 'Not found' });

    await expect(akeneoClient.jobs.launchExportJob('nonexistent')).rejects.toThrow();
  });
});
