import { AkeneoApiClient } from '../akeneo-api-client';
import { PaginatedResponse, StepAssignee, Workflow, WorkflowTask } from '../../types';

export type ListStepAssigneesRequest = {
  page?: number;
  limit?: number;
};

export type ListTasksRequest = {
  page?: number;
  limit?: number;
  step_uuid?: string;
};

export type CompleteTaskResponse = {
  status: string;
};

export type ListWorkflowsParams = {
  page?: number;
  limit?: number;
};

export type WorkflowExecutionRequest = {
  workflow: { uuid: string };
  product?: { uuid: string };
  product_model?: { code: string };
};

export type WorkflowExecutionsResponse = {
  code?: number;
  message?: string;
  processed?: number;
  errors?: { index?: number; message?: string }[];
};

export class WorkflowApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/workflows';
  }

  async list(params?: ListWorkflowsParams): Promise<PaginatedResponse<Workflow>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => {
      return response.data;
    });
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

  async startExecutions(data: WorkflowExecutionRequest[]): Promise<WorkflowExecutionsResponse> {
    return this.client.httpClient.post(`${this.endpoint}/executions`, data).then((response) => {
      return response.data;
    });
  }
}
