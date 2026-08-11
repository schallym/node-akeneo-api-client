export type Product = {
  uuid: string;
  identifier?: string;
  enabled: boolean;
  family: string | null;
  categories: string[];
  groups: string[];
  parent?: string | null;
  values: { [attributeCode: string]: ProductValue[] };
  associations?: { [associationTypeCode: string]: ProductAssociation };
  quantified_associations?: { [quantifiedAssociationTypeCode: string]: ProductQuantifiedAssociation };
  created: string;
  updated: string;
  metadata?: {
    workflow_status?: string;
  };
  quality_scores?: ProductQualityScore[];
  completenesses?: ProductCompleteness[];
  readiness?: ProductReadiness;
  workflow_execution_statuses?: ProductWorkflowExecutionStatus[];
};

export type ProductUuid = Omit<Product, 'identifier'> & {
  root_parent?: string;
};

export type ProductValue = {
  data: string | number | boolean | object | string[];
  locale?: string | null;
  scope?: string | null;
  attribute_type?: string;
  linked_data?: [];
  reference_data_name?: string;
};

export type ProductAssociation = {
  groups: string[];
  products: string[];
  product_models: string[];
};

export type ProductQuantifiedAssociation = {
  products: ProductQuantifiedAssociationProduct[];
  product_models: ProductQuantifiedAssociationProductModel[];
};

export type ProductQuantifiedAssociationProduct = {
  identifier: string;
  quantity: number;
};

export type ProductQuantifiedAssociationProductModel = {
  code: string;
  quantity: number;
};

export type ProductQualityScore = {
  scope: string;
  locale: string;
  data: 'A' | 'B' | 'C' | 'D' | 'E';
};

export type ProductCompleteness = {
  scope: string;
  locale: string;
  data: number;
};

export type ProductReadiness = {
  aggregated_scores_by_scope?: {
    scope?: string;
    score?: number;
  }[];
  scores_by_scope_and_locale?: {
    [readinessCode: string]: {
      scope?: string;
      locale?: string;
      score?: number;
      unmet_requirements?: {
        field?: string;
        operator?: string;
        value?: unknown;
      }[];
    }[];
  };
};

export type ProductWorkflowExecutionStatus = {
  uuid?: string;
  status?: 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string | null;
  workflow?: {
    uuid?: string;
    code?: string;
    labels?: { [localeCode: string]: string };
  };
  tasks?: {
    uuid?: string;
    status?: 'in_progress';
    created_at?: string;
    step?: {
      uuid?: string;
      code?: string;
      labels?: { [localeCode: string]: string };
    };
  }[];
};
