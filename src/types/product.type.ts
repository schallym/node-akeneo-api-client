export type ProductType = {
  uuid: string;
  identifier?: string;
  enabled: boolean;
  family: string;
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
};

export type ProductUuid = Omit<ProductType, 'identifier'>;

export type ProductValue = {
  data: any;
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
  score: string;
};

export type ProductCompleteness = {
  scope: string;
  locale: string;
  data: number;
};
