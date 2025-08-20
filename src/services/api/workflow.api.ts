import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, StepAssignee, Workflow, WorkflowTask } from '../../types';

export type ListStepAssigneesRequest = {
  page?: number;
  limit?: number;
};

export type ListTasksRequest = {
  page?: number;
  limit?: number;
  step_uuid?: number;
};

export type CompleteTaskResponse = {
  status: string;
};

export class WorkflowApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/workflows';
  }

  async get(workflowUuid: string): Promise<Workflow> {
    return this.client.httpClient.get(`${this.endpoint}/${workflowUuid}`).then((response) => {
      return response.data;
    });
  }

  async listStepAssignees(
    stepUuid: string,
    params?: ListStepAssigneesRequest,
  ): Promise<PaginatedResponse<StepAssignee>> {
    return this.client.httpClient.get(`${this.endpoint}/steps/${stepUuid}/assignees`, { params }).then((response) => {
      return response.data;
    });
  }

  async listTasks(params?: ListTasksRequest): Promise<PaginatedResponse<WorkflowTask>> {
    return this.client.httpClient.get(`${this.endpoint}/tasks`, { params }).then((response) => {
      return response.data;
    });
  }

  async completeTask(taskUuid: string): Promise<CompleteTaskResponse> {
    return this.client.httpClient.patch(`${this.endpoint}/tasks/${taskUuid}`).then((response) => {
      return response.data;
    });
  }
}
