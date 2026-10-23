import nock from 'nock';
import associationTypeMock from './mocks/association-type.mock';
import { AssociationType } from '../src/types';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('AssociationTypesApi E2E', () => {
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

  it('should update or create several association types', async () => {
    const types: Partial<AssociationType>[] = [
      { code: 'assoc1', labels: { en_US: 'A1' }, is_quantified: false, is_two_way: false },
      { code: 'assoc2', labels: { en_US: 'A2' }, is_quantified: true, is_two_way: true },
    ];

    const mockResponse =
      JSON.stringify({ line: 1, code: 'assoc1', status_code: 200, message: 'ok' }) +
      '\n' +
      JSON.stringify({ line: 2, code: 'assoc2', status_code: 201, message: 'created' });

    nock(baseUrl).patch('/api/rest/v1/association-types').reply(200, mockResponse);

    const result = await akeneoClient.associationTypes.updateOrCreateSeveral(types);

    expect(result).toEqual([
      { line: 1, code: 'assoc1', status_code: 200, message: 'ok' },
      { line: 2, code: 'assoc2', status_code: 201, message: 'created' },
    ]);
  });

  it('should retrieve an automatic association type with its rule', async () => {
    nock(baseUrl).get('/api/rest/v1/association-types/compatible_with').reply(200, associationTypeMock.get);

    const associationType = await akeneoClient.associationTypes.get('compatible_with');

    expect(associationType).toEqual(associationTypeMock.get);
    expect(associationType.rule?.enabled).toBe(true);
    expect(associationType.rule?.condition_groups.conditions[1].operator).toBe('matches_any');
  });

  it('should list association types with their rules', async () => {
    nock(baseUrl).get('/api/rest/v1/association-types').reply(200, associationTypeMock.list);

    const result = await akeneoClient.associationTypes.list();

    expect(result).toEqual(associationTypeMock.list);
    expect(result._embedded.items[0].rule).toBeNull();
    expect(result._embedded.items[1].rule?.base_product_selection?.operator).toBe('AND');
    expect(result._embedded.items[2].rule?.compatible_record_selection?.reference_entity_code).toBe('vehicle');
  });

  it('should retrieve an association type whose rule selects reference entity records', async () => {
    nock(baseUrl)
      .get('/api/rest/v1/association-types/fits_vehicle')
      .reply(200, associationTypeMock.getWithRecordSelection);

    const associationType = await akeneoClient.associationTypes.get('fits_vehicle');

    expect(associationType).toEqual(associationTypeMock.getWithRecordSelection);
    expect(associationType.rule?.compatible_product_selection).toBeUndefined();
    expect(associationType.rule?.compatible_record_selection).toEqual({
      reference_entity_code: 'vehicle',
      operator: 'AND',
      criteria: [{ field: 'make', operator: 'IN', value: ['ford'], scope: null, locale: null }],
    });
  });

  it('should create an association type with a rule', async () => {
    nock(baseUrl).post('/api/rest/v1/association-types', associationTypeMock.get).reply(201);

    await akeneoClient.associationTypes.create(associationTypeMock.get);
  });

  it('should update an association type with a partial rule', async () => {
    const data = { rule: { enabled: false } };

    nock(baseUrl).patch('/api/rest/v1/association-types/compatible_with', data).reply(204);

    await akeneoClient.associationTypes.update('compatible_with', data);
  });

  it('should update or create several association types with rules', async () => {
    const types = [
      { code: 'compatible_with', rule: { enabled: false } },
      { code: 'X_SELL', rule: null },
    ];

    nock(baseUrl)
      .patch('/api/rest/v1/association-types', types.map((type) => JSON.stringify(type)).join('\n'))
      .reply(200, JSON.stringify({ line: 1, code: 'compatible_with', status_code: 204 }));

    const result = await akeneoClient.associationTypes.updateOrCreateSeveral(types);

    expect(result).toEqual([{ line: 1, code: 'compatible_with', status_code: 204 }]);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/association-types').reply(400, { code: 400, message: 'Bad request' });

    await expect(
      akeneoClient.associationTypes.updateOrCreateSeveral([
        { code: 'bad', labels: {}, is_quantified: false, is_two_way: false },
      ]),
    ).rejects.toThrow();
  });
});
