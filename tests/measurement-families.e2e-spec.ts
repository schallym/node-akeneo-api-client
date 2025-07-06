import nock from 'nock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import measurementFamilyMock from './mocks/measurement-family.mock';

describe('MeasurementFamiliesApi E2E', () => {
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

  it('should fetch a list of measurement families', async () => {
    nock(baseUrl).get('/api/rest/v1/measurement-families').reply(200, measurementFamilyMock.get);

    const result = await akeneoClient.measurementFamilies.list();
    expect(result).toEqual(measurementFamilyMock.get);
  });

  it('should handle errors when fetching measurement families', async () => {
    nock(baseUrl).get('/api/rest/v1/measurement-families').reply(500, { message: 'API error' });

    await expect(akeneoClient.measurementFamilies.list()).rejects.toThrow();
  });

  it('should update or create several measurement families', async () => {
    const data = [
      { code: 'weight', labels: { en_US: 'Weight' } },
      { code: 'length', labels: { en_US: 'Length' } },
    ];

    nock(baseUrl).patch('/api/rest/v1/measurement-families').reply(200, measurementFamilyMock.updateCreateSeveral);

    const result = await akeneoClient.measurementFamilies.updateOrCreateSeveral(data);

    expect(result).toEqual(measurementFamilyMock.updateCreateSeveral);
  });

  it('should handle API errors when updating or creating measurement families', async () => {
    nock(baseUrl).patch('/api/rest/v1/measurement-families').reply(400, { message: 'Bad request' });

    await expect(akeneoClient.measurementFamilies.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });
});
