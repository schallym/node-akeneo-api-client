import nock from 'nock';
import dataArchitectAgentMock from './mocks/data-architect-agent.mock';
import { CreateModelizationSuggestionRequest } from '../src/services/api';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('DataArchitectAgentApi E2E', () => {
  let akeneoClient: AkeneoClient;
  const uuid = 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e';

  beforeAll(() => {
    akeneoClient = setupAkeneoClient();
  });

  afterAll(() => {
    teardownNock();
  });

  beforeEach(() => {
    setupNock();
  });

  it('should create a modelization suggestion', async () => {
    const data: CreateModelizationSuggestionRequest = { source: 'api', description: 'Need a material attribute' };
    nock(baseUrl)
      .post('/api/rest/v1/data-model-designer/modelization-suggestion/attribute', (body) => !!body)
      .reply(201, dataArchitectAgentMock.create);

    const result = await akeneoClient.dataArchitectAgent.createModelizationSuggestion(data);
    expect(result).toEqual(dataArchitectAgentMock.create);
  });

  it('should get a modelization suggestion', async () => {
    nock(baseUrl)
      .get(`/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}`)
      .reply(200, dataArchitectAgentMock.get);

    const result = await akeneoClient.dataArchitectAgent.getModelizationSuggestion(uuid);
    expect(result).toEqual(dataArchitectAgentMock.get);
  });

  it('should approve a modelization suggestion', async () => {
    nock(baseUrl)
      .post(`/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}/approve`)
      .reply(200, dataArchitectAgentMock.approve);

    const result = await akeneoClient.dataArchitectAgent.approveModelizationSuggestion(uuid, {
      attribute_code: 'material',
    });
    expect(result).toEqual(dataArchitectAgentMock.approve);
  });

  it('should decline a modelization suggestion', async () => {
    nock(baseUrl).post(`/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}/decline`).reply(204);

    await expect(
      akeneoClient.dataArchitectAgent.declineModelizationSuggestion(uuid, { reject_reason: 'not needed' }),
    ).resolves.toBeUndefined();
  });

  it('should list modelization suggestions', async () => {
    nock(baseUrl)
      .get('/api/rest/v1/data-model-designer/modelization-suggestions')
      .query({ status: 'draft' })
      .reply(200, dataArchitectAgentMock.list);

    const result = await akeneoClient.dataArchitectAgent.listModelizationSuggestions({ status: 'draft' });
    expect(result).toEqual(dataArchitectAgentMock.list);
  });

  it('should handle errors when getting a modelization suggestion', async () => {
    nock(baseUrl)
      .get('/api/rest/v1/data-model-designer/modelization-suggestion/bad')
      .reply(404, { message: 'Not found' });

    await expect(akeneoClient.dataArchitectAgent.getModelizationSuggestion('bad')).rejects.toThrow();
  });
});
