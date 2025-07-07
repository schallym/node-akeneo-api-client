export type ProductModelType = {
  code: string;
  family: string;
  family_variant: string;
  categories: string[];
  groups: string[];
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
};

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
  score: string;
};
