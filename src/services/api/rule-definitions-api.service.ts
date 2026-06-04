import { AkeneoApiClient } from '../akeneo-api-client';
import {
  PaginatedResponse,
  RuleDefinition,
  RuleDefinitionAction,
  RuleDefinitionCondition,
  RuleDefinitionTrigger,
} from '../../types';

export type RuleDefinitionsSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
  codes?: string;
  type?: 'product' | 'record';
  execution_type?: 'triggered' | 'scheduled' | 'workflow_based';
  enabled?: boolean;
};

export type CreateOrUpdateRuleDefinitionRequest = {
  type: 'product' | 'record';
  reference_entity_identifier?: string | null;
  conditions?: RuleDefinitionCondition[];
  actions: RuleDefinitionAction[];
  labels?: { [localeCode: string]: string };
  priority?: number;
  enabled?: boolean;
  execution_type?: 'triggered' | 'scheduled' | 'workflow_based';
  triggers?: RuleDefinitionTrigger[];
};

export class RuleDefinitionsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/rule-definitions';
  }

  async list(params?: RuleDefinitionsSearchParams): Promise<PaginatedResponse<RuleDefinition>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async get(code: string): Promise<RuleDefinition> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  async createOrUpdate(code: string, data: CreateOrUpdateRuleDefinitionRequest): Promise<void> {
    await this.client.httpClient.put(`${this.endpoint}/${code}`, data);
  }
}
