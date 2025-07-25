import nock from 'nock';
import { CreateVariantFamilyRequest } from '../src/services/api';
import { Family, VariantFamily } from '../src/types';
import familyMock from './mocks/family.mock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('akeneoClient.families E2E', () => {
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

  it('should update or create several families', async () => {
    const families: Partial<Family>[] = [
      { code: 'family1', labels: { en_US: 'Family 1' } },
      { code: 'family2', labels: { en_US: 'Family 2' } },
    ];

    const mockResponse = '{"code":200,"attributes":["attr1"]}\n' + '{"code":201,"attributes":["attr2"]}';

    nock(baseUrl).patch('/api/rest/v1/families').reply(200, mockResponse);

    const result = await akeneoClient.families.updateOrCreateSeveral(families);

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

    await expect(akeneoClient.families.createVariantFamily(familyCode, data)).resolves.toBeUndefined();
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/families').reply(400, { code: 400, message: 'Bad request' });

    await expect(akeneoClient.families.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });

  it('should list variant families', async () => {
    const familyCode = 'family1';
    nock(baseUrl).get(`/api/rest/v1/families/${familyCode}/variants`).reply(200, familyMock.listVariantFamilies);

    const result = await akeneoClient.families.listVariantFamilies(familyCode);

    expect(result._embedded.items).toHaveLength(1);
    expect(result._embedded.items[0].code).toBe('tables');
  });

  it('should get a variant family', async () => {
    const familyCode = 'tables';
    nock(baseUrl).get(`/api/rest/v1/families/${familyCode}/variants`).reply(200, familyMock.getVariantFamily);

    const result = await akeneoClient.families.getVariantFamily(familyCode);

    expect(result.code).toBe('tables');
    expect(result.labels.en_US).toBe('Tables');
  });

  it('should update a variant family', async () => {
    const familyCode = 'tables';
    const code = 'variant1';
    const data = { labels: { en_US: 'Updated Variant' } };

    nock(baseUrl).patch(`/api/rest/v1/families/${familyCode}/variants/${code}`).reply(204);

    await expect(akeneoClient.families.updateVariantFamily(familyCode, code, data)).resolves.toBeUndefined();
  });

  it('should handle variant family creation errors gracefully', async () => {
    const familyCode = 'family1';
    const data: CreateVariantFamilyRequest = {
      code: 'family1',
      variant_attribute_sets: [],
    };

    nock(baseUrl)
      .post(`/api/rest/v1/families/${familyCode}/variants`)
      .reply(400, { code: 400, message: 'Bad request' });

    await expect(akeneoClient.families.createVariantFamily(familyCode, data)).rejects.toThrow();
  });

  it('should update or create several variant families', async () => {
    const familyCode = 'family1';
    const variantFamilies: Partial<VariantFamily>[] = [
      { code: 'variantFamily1', labels: { en_US: 'Variant Family 1' } },
      { code: 'variantFamily2', labels: { en_US: 'Variant Family 2' } },
    ];

    nock(baseUrl)
      .patch(`/api/rest/v1/families/${familyCode}/variants`)
      .reply(200, familyMock.updateCreateSeveralVariantFamilies);

    const result = await akeneoClient.families.updateOrCreateSeveralVariantFamilies(familyCode, variantFamilies);

    expect(result).toEqual([
      {
        line: 1,
        code: 'variantFamily1',
        status_code: 201,
        message: 'Variant family variantFamily1 created successfully.',
      },
      {
        line: 2,
        code: 'variantFamily2',
        status_code: 201,
        message: 'Variant family variantFamily2 created successfully.',
      },
    ]);
  });
});
