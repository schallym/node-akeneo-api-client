import nock from 'nock';
import { AkeneoApiClient } from '../src/services';
import { CreateVariantFamilyRequest, FamiliesApi } from '../src/services/api';
import { Family } from '../src/types';

describe('FamiliesApi E2E', () => {
  const baseUrl = 'https://akeneo.test';
  let akeneoClient: AkeneoApiClient;
  let familiesApi: FamiliesApi;

  beforeAll(() => {
    akeneoClient = new AkeneoApiClient({
      baseUrl,
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    });
    familiesApi = new FamiliesApi(akeneoClient);
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

  it('should update or create several families', async () => {
    const families: Partial<Family>[] = [
      { code: 'family1', labels: { en_US: 'Family 1' } },
      { code: 'family2', labels: { en_US: 'Family 2' } },
    ];

    const mockResponse = '{"code":200,"attributes":["attr1"]}\n' + '{"code":201,"attributes":["attr2"]}';

    nock(baseUrl).patch('/api/rest/v1/families').reply(200, mockResponse);

    const result = await familiesApi.updateOrCreateSeveral(families);

    expect(result).toEqual([
      { code: 200, attributes: ['attr1'] },
      { code: 201, attributes: ['attr2'] },
    ]);
  });

  it('should create a variant family', async () => {
    const familyCode = 'family1';
    const data: CreateVariantFamilyRequest = {
      code: 'family1',
      variant_attribute_sets: [],
    };

    nock(baseUrl).post(`/api/rest/v1/families/${familyCode}/variants`).reply(201);

    await expect(familiesApi.createVariantFamily(familyCode, data)).resolves.toBeUndefined();
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/families').reply(400, { code: 400, message: 'Bad request' });

    await expect(familiesApi.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });
});
