import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import workflowMock from './mocks/workflow.mock';

describe('WorkflowApi E2E', () => {
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

  it('should get a workflow by uuid', async () => {
    const workflowUuid = '6f37476a-04c2-46c0-b6d0-e18316959068';
    nock(baseUrl).get(`/api/rest/v1/workflows/${workflowUuid}`).reply(200, workflowMock.get);

    const result = await akeneoClient.workflows.get(workflowUuid);
    expect(result).toEqual(workflowMock.get);
  });

  it('should list step assignees', async () => {
    const stepUuid = 'f626d0e5-84a5-41fc-8215-65508c253edb';
    nock(baseUrl).get(`/api/rest/v1/workflows/steps/${stepUuid}/assignees`).reply(200, workflowMock.listStepsAssignees);

    const result = await akeneoClient.workflows.listStepAssignees(stepUuid);
    expect(result).toEqual(workflowMock.listStepsAssignees);
  });

  it('should list step assignees with params', async () => {
    const stepUuid = 'f626d0e5-84a5-41fc-8215-65508c253edb';
    const params = { page: 1, limit: 10 };
    nock(baseUrl)
      .get(`/api/rest/v1/workflows/steps/${stepUuid}/assignees`)
      .query(params)
      .reply(200, workflowMock.listStepsAssignees);

    const result = await akeneoClient.workflows.listStepAssignees(stepUuid, params);
    expect(result).toEqual(workflowMock.listStepsAssignees);
  });

  it('should list tasks', async () => {
    nock(baseUrl).get('/api/rest/v1/workflows/tasks').reply(200, workflowMock.listTasks);

    const result = await akeneoClient.workflows.listTasks();
    expect(result).toEqual(workflowMock.listTasks);
  });

  it('should list tasks with params', async () => {
    const params = { page: 1, limit: 10, step_uuid: 123 };
    nock(baseUrl).get('/api/rest/v1/workflows/tasks').query(params).reply(200, workflowMock.listTasks);

    const result = await akeneoClient.workflows.listTasks(params);
    expect(result).toEqual(workflowMock.listTasks);
  });

  it('should complete a task', async () => {
    const taskUuid = '8f6c2d18-fbd4-4f7e-81df-cb3dc368fe07';
    nock(baseUrl).patch(`/api/rest/v1/workflows/tasks/${taskUuid}`).reply(200, workflowMock.completeTask);

    const result = await akeneoClient.workflows.completeTask(taskUuid);
    expect(result).toEqual(workflowMock.completeTask);
  });

  it('should handle errors when getting a workflow', async () => {
    const workflowUuid = 'invalid-uuid';
    nock(baseUrl).get(`/api/rest/v1/workflows/${workflowUuid}`).reply(404, { message: 'Workflow not found' });

    await expect(akeneoClient.workflows.get(workflowUuid)).rejects.toThrow();
  });

  it('should handle errors when listing step assignees', async () => {
    const stepUuid = 'invalid-step-uuid';
    nock(baseUrl)
      .get(`/api/rest/v1/workflows/steps/${stepUuid}/assignees`)
      .reply(500, { message: 'Internal server error' });

    await expect(akeneoClient.workflows.listStepAssignees(stepUuid)).rejects.toThrow();
  });

  it('should handle errors when listing tasks', async () => {
    nock(baseUrl).get('/api/rest/v1/workflows/tasks').reply(500, { message: 'Internal server error' });

    await expect(akeneoClient.workflows.listTasks()).rejects.toThrow();
  });

  it('should handle errors when completing a task', async () => {
    const taskUuid = 'invalid-task-uuid';
    nock(baseUrl).patch(`/api/rest/v1/workflows/tasks/${taskUuid}`).reply(400, { message: 'Bad request' });

    await expect(akeneoClient.workflows.completeTask(taskUuid)).rejects.toThrow();
  });
});
