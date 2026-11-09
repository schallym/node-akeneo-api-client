import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import businessUnitMock from './mocks/business-unit.mock';

describe('BusinessUnitsApi E2E', () => {
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

  it('should fetch the list of business units', async () => {
    nock(baseUrl).get('/api/rest/v1/business-units').reply(200, businessUnitMock.list);

    const result = await akeneoClient.businessUnits.list();
    expect(result).toEqual(businessUnitMock.list);
  });

  it('should handle errors when listing business units', async () => {
    nock(baseUrl).get('/api/rest/v1/business-units').reply(500, { message: 'API error' });

    await expect(akeneoClient.businessUnits.list()).rejects.toThrow();
  });

  it('should create a business unit', async () => {
    nock(baseUrl).post('/api/rest/v1/business-units', businessUnitMock.createOrUpdate).reply(201, businessUnitMock.get);

    const result = await akeneoClient.businessUnits.createOrUpdate(businessUnitMock.createOrUpdate);
    expect(result).toEqual(businessUnitMock.get);
  });

  it('should update an existing business unit', async () => {
    const data = { code: 'ziggy_wear', labels: { fr_FR: null } };
    const updated = {
      ...businessUnitMock.get,
      labels: { en_US: 'Ziggy Wear' },
      updated_at: '2026-11-05T10:00:00+00:00',
    };
    nock(baseUrl).post('/api/rest/v1/business-units', data).reply(200, updated);

    const result = await akeneoClient.businessUnits.createOrUpdate(data);
    expect(result).toEqual(updated);
  });

  it('should handle validation errors when creating a business unit', async () => {
    nock(baseUrl).post('/api/rest/v1/business-units').reply(422, { code: 422, message: 'Validation failed.' });

    await expect(akeneoClient.businessUnits.createOrUpdate({ code: 'bad code' })).rejects.toThrow();
  });
});
