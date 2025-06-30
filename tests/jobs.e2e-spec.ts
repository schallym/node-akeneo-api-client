import nock from 'nock';
import { AkeneoApiClient } from '../src/services';
import { JobsApi, LaunchJobResponse } from '../src/services/api';

describe('JobsApi E2E', () => {
  const baseUrl = 'https://akeneo.test';
  let akeneoClient: AkeneoApiClient;
  let jobsApi: JobsApi;

  beforeAll(() => {
    akeneoClient = new AkeneoApiClient({
      baseUrl,
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    });
    jobsApi = new JobsApi(akeneoClient);
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
    nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expires_in: 3600,
    });
  });

  it('should launch an export job', async () => {
    const mockResponse: LaunchJobResponse = { execution_id: 'exec_export_1' };
    nock(baseUrl).post('/api/rest/v1/jobs/export/job_123').reply(200, mockResponse);

    const result = await jobsApi.launchExportJob('job_123');
    expect(result).toEqual(mockResponse);
  });

  it('should launch an import job', async () => {
    const mockResponse: LaunchJobResponse = { execution_id: 'exec_import_1' };
    nock(baseUrl).post('/api/rest/v1/jobs/import/job_456').reply(200, mockResponse);

    const result = await jobsApi.launchImportJob('job_456');
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).post('/api/rest/v1/jobs/export/nonexistent').reply(404, { code: 404, message: 'Not found' });

    await expect(jobsApi.launchExportJob('nonexistent')).rejects.toThrow();
  });
});
