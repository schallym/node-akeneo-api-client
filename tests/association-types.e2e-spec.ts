import nock from 'nock';
import { AssociationType } from '../src/types';
import AkeneoClient from '../src/akeneo-client';
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

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/association-types').reply(400, { code: 400, message: 'Bad request' });

    await expect(
      akeneoClient.associationTypes.updateOrCreateSeveral([
        { code: 'bad', labels: {}, is_quantified: false, is_two_way: false },
      ]),
    ).rejects.toThrow();
  });
});
