import nock from 'nock';
import { AttributeGroup } from '../src/types';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('AttributeGroupsApi E2E', () => {
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

  it('should update or create several attribute groups', async () => {
    const groups: Partial<AttributeGroup>[] = [
      { code: 'group1', sort_order: 1 },
      { code: 'group2', sort_order: 2 },
    ];

    const mockResponse =
      JSON.stringify({ line: 1, code: 'group1', status_code: 200, message: 'ok' }) +
      '\n' +
      JSON.stringify({ line: 2, code: 'group2', status_code: 201, message: 'created' });

    nock(baseUrl).patch('/api/rest/v1/attribute-groups').reply(200, mockResponse);

    const result = await akeneoClient.attributeGroups.updateOrCreateSeveral(groups);

    expect(result).toEqual([
      { line: 1, code: 'group1', status_code: 200, message: 'ok' },
      { line: 2, code: 'group2', status_code: 201, message: 'created' },
    ]);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/attribute-groups').reply(400, { code: 400, message: 'Bad request' });

    await expect(akeneoClient.attributeGroups.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });
});
