export type RuleDefinition = {
  code: string;
  type: 'product' | 'record';
  execution_type?: string;
  enabled?: boolean;
  priority?: number;
  reference_entity_identifier?: string | null;
  labels?: { [localeCode: string]: string };
  conditions?: RuleDefinitionCondition[];
  actions?: RuleDefinitionAction[];
  triggers?: RuleDefinitionTrigger[];
  action_types?: string[];
};

export type RuleDefinitionCondition = {
  field?: string;
  operator?: string;
  value?: unknown;
  locale?: string | null;
  scope?: string | null;
  [key: string]: unknown;
};

export type RuleDefinitionAction = {
  type?: string;
  [key: string]: unknown;
};

export type RuleDefinitionTrigger = {
  field?: string;
  locale?: string;
  scope?: string;
};
