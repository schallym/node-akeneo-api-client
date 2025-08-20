import { WorkflowApi } from './workflow.api';
import { AkeneoApiClient } from '../akeneo-api-client';
import { StepAssignee, Workflow, WorkflowTask } from '../../types';

describe('WorkflowApi', () => {
  let client: AkeneoApiClient;
  let httpClient: any;
  let api: WorkflowApi;

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
      patch: jest.fn(),
    };
    client = { httpClient } as unknown as AkeneoApiClient;
    api = new WorkflowApi(client);
  });

  it('should get a workflow by uuid', async () => {
    const workflow: Workflow = { uuid: '123' } as Workflow;
    httpClient.get.mockResolvedValue({ data: workflow });

    const result = await api.get('123');

    expect(httpClient.get).toHaveBeenCalledWith('/api/rest/v1/workflows/123');
    expect(result).toEqual(workflow);
  });

  it('should list step assignees', async () => {
    const assignees = {
      _embedded: {
        items: [
          {
            uuid: '25566245-55c3-42ce-86d9-8610ac459fa8',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
          } as StepAssignee,
        ],
      },
    };
    httpClient.get.mockResolvedValue({ data: assignees });

    const result = await api.listStepAssignees('step-123');

    expect(httpClient.get).toHaveBeenCalledWith('/api/rest/v1/workflows/steps/step-123/assignees', {
      params: undefined,
    });
    expect(result).toEqual(assignees);
  });

  it('should list step assignees with params', async () => {
    const assignees = {
      _embedded: {
        items: [
          {
            uuid: '25566245-55c3-42ce-86d9-8610ac459fa8',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
          } as StepAssignee,
        ],
      },
    };
    const params = { page: 1, limit: 10 };
    httpClient.get.mockResolvedValue({ data: assignees });

    const result = await api.listStepAssignees('step-123', params);

    expect(httpClient.get).toHaveBeenCalledWith('/api/rest/v1/workflows/steps/step-123/assignees', { params });
    expect(result).toEqual(assignees);
  });

  it('should list tasks', async () => {
    const tasks = { _embedded: { items: [{ uuid: '456' } as WorkflowTask] } };
    httpClient.get.mockResolvedValue({ data: tasks });

    const result = await api.listTasks();

    expect(httpClient.get).toHaveBeenCalledWith('/api/rest/v1/workflows/tasks', { params: undefined });
    expect(result).toEqual(tasks);
  });

  it('should list tasks with params', async () => {
    const tasks = { _embedded: { items: [{ uuid: '456' } as WorkflowTask] } };
    const params = { page: 2, limit: 20, step_uuid: 789 };
    httpClient.get.mockResolvedValue({ data: tasks });

    const result = await api.listTasks(params);

    expect(httpClient.get).toHaveBeenCalledWith('/api/rest/v1/workflows/tasks', { params });
    expect(result).toEqual(tasks);
  });

  it('should complete a task', async () => {
    const response = { status: 'completed' };
    httpClient.patch.mockResolvedValue({ data: response });

    const result = await api.completeTask('task-456');

    expect(httpClient.patch).toHaveBeenCalledWith('/api/rest/v1/workflows/tasks/task-456');
    expect(result).toEqual(response);
  });
});
