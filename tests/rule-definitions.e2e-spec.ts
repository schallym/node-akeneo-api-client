import nock from 'nock';
import ruleDefinitionMock from './mocks/rule-definition.mock';
import { CreateOrUpdateRuleDefinitionRequest } from '../src/services/api';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('RuleDefinitionsApi E2E', () => {
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

  it('should list rule definitions', async () => {
    nock(baseUrl).get('/api/rest/v1/rule-definitions').query({ type: 'product' }).reply(200, ruleDefinitionMock.list);

    const result = await akeneoClient.ruleDefinitions.list({ type: 'product' });
    expect(result).toEqual(ruleDefinitionMock.list);
  });

  it('should get a rule definition by code', async () => {
    nock(baseUrl).get('/api/rest/v1/rule-definitions/set_brand').reply(200, ruleDefinitionMock.get);

    const result = await akeneoClient.ruleDefinitions.get('set_brand');
    expect(result).toEqual(ruleDefinitionMock.get);
  });

  it('should create or update a rule definition', async () => {
    const data: CreateOrUpdateRuleDefinitionRequest = {
      type: 'product',
      actions: [{ type: 'set', field: 'brand', value: 'Akeneo' }],
    };
    nock(baseUrl)
      .put('/api/rest/v1/rule-definitions/set_brand', (body) => !!body)
      .reply(204);

    await expect(akeneoClient.ruleDefinitions.createOrUpdate('set_brand', data)).resolves.toBeUndefined();
  });

  it('should handle errors when getting a rule definition', async () => {
    nock(baseUrl).get('/api/rest/v1/rule-definitions/bad').reply(404, { message: 'Not found' });

    await expect(akeneoClient.ruleDefinitions.get('bad')).rejects.toThrow();
  });
});
