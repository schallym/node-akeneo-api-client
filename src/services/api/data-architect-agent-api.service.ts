import { AkeneoApiClient } from '../akeneo-api-client';
import {
  ModelizationSuggestion,
  ModelizationSuggestionSource,
  ModelizationSuggestionStatus,
  PaginatedResponse,
} from '../../types';

export type CreateModelizationSuggestionRequest = {
  source: ModelizationSuggestionSource;
  description: string;
  code?: string | null;
  type?: string | null;
  additional_comments?: string | null;
};

export type ApproveModelizationSuggestionRequest = {
  attribute_code?: string;
  attribute_type?: string;
  attribute_labels?: { [localeCode: string]: string };
  attribute_group?: string;
  scopable?: boolean;
  localizable?: boolean;
};

export type ApproveModelizationSuggestionResponse = {
  created?: string[];
  skipped?: string[];
  errors?: { [key: string]: string };
};

export type DeclineModelizationSuggestionRequest = {
  reject_reason?: string;
};

export type ModelizationSuggestionsSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
  codes?: string;
  status?: ModelizationSuggestionStatus;
  source?: string;
  author?: string;
};

export class DataArchitectAgentApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/data-model-designer';
  }

  async createModelizationSuggestion(data: CreateModelizationSuggestionRequest): Promise<ModelizationSuggestion> {
    return this.client.httpClient
      .post(`${this.endpoint}/modelization-suggestion/attribute`, data)
      .then((response) => response.data);
  }

  async getModelizationSuggestion(uuid: string): Promise<ModelizationSuggestion> {
    return this.client.httpClient
      .get(`${this.endpoint}/modelization-suggestion/${uuid}`)
      .then((response) => response.data);
  }

  async approveModelizationSuggestion(
    uuid: string,
    data?: ApproveModelizationSuggestionRequest,
  ): Promise<ApproveModelizationSuggestionResponse> {
    return this.client.httpClient
      .post(`${this.endpoint}/modelization-suggestion/${uuid}/approve`, data ?? {})
      .then((response) => response.data);
  }

  async declineModelizationSuggestion(uuid: string, data?: DeclineModelizationSuggestionRequest): Promise<void> {
    await this.client.httpClient.post(`${this.endpoint}/modelization-suggestion/${uuid}/decline`, data ?? {});
  }

  async listModelizationSuggestions(
    params?: ModelizationSuggestionsSearchParams,
  ): Promise<PaginatedResponse<ModelizationSuggestion>> {
    return this.client.httpClient
      .get(`${this.endpoint}/modelization-suggestions`, { params })
      .then((response) => response.data);
  }
}
