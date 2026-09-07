export type ProductModelType = {
  code: string;
  family: string | null;
  family_variant: string;
  categories: string[];
  parent?: string | null;
  values: { [attributeCode: string]: ProductModelValue[] };
  associations?: { [associationTypeCode: string]: ProductModelAssociation };
  quantified_associations?: { [quantifiedAssociationTypeCode: string]: ProductModelQuantifiedAssociation };
  created: string;
  updated: string;
  metadata?: {
    workflow_status?: string;
  };
  quality_scores?: ProductModelQualityScore[];
  readiness?: ProductModelReadiness;
  workflow_execution_statuses?: ProductModelWorkflowExecutionStatus[];
  proposal_review_status?: ProductModelProposalReviewStatus;
};

export type ProductModel = ProductModelType;

export type ProductModelValue = {
  data: string | number | boolean | object | string[];
  locale?: string | null;
  scope?: string | null;
  attribute_type?: string;
  linked_data?: [];
  reference_data_name?: string;
};

export type ProductModelAssociation = {
  groups: string[];
  products: string[];
  product_models: string[];
};

export type ProductModelQuantifiedAssociation = {
  products: ProductModelQuantifiedAssociationProduct[];
  product_models: ProductModelQuantifiedAssociationProductModel[];
};

export type ProductModelQuantifiedAssociationProduct = {
  identifier: string;
  quantity: number;
};

export type ProductModelQuantifiedAssociationProductModel = {
  code: string;
  quantity: number;
};

export type ProductModelQualityScore = {
  scope: string;
  locale: string;
  data: 'A' | 'B' | 'C' | 'D' | 'E';
};

export type ProductModelReadiness = {
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

/**
 * Review status of each change carried by a draft, grouped like the `values` property so that a change can be
 * matched on its attribute code, locale and scope. Only returned by the draft endpoint when the
 * `with_proposal_review_status` query parameter is set to `true`.
 */
export type ProductModelProposalReviewStatus = {
  values?: { [attributeCode: string]: ProductModelProposalReviewStatusChange[] };
};

export type ProductModelProposalReviewStatusChange = {
  locale?: string | null;
  scope?: string | null;
  review_status?: ProductModelProposalReviewStatusValue;
};

/**
 * While `metadata.workflow_status` is `proposal_waiting_for_approval`, a `draft` change is one that was submitted
 * and then rejected by a reviewer (or edited by the author after submission), whereas a `to_review` change is still
 * pending. Akeneo documents that clients must treat unknown values as opaque, hence the widened `string` branch.
 */
export type ProductModelProposalReviewStatusValue = 'draft' | 'to_review' | (string & {});

export type ProductModelWorkflowExecutionStatus = {
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
