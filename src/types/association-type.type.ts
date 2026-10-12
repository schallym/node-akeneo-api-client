export type AssociationType = {
  code: string;
  labels: { [localeCode: string]: string };
  is_quantified: boolean;
  is_two_way: boolean;
  rule?: AssociationTypeRule | null;
};

export type AssociationTypeRule = {
  enabled: boolean;
  base_product_selection: AssociationTypeProductSelection;
  compatible_product_selection: AssociationTypeProductSelection;
  condition_groups: AssociationTypeConditionGroups;
};

export type AssociationTypeRuleWrite = Partial<AssociationTypeRule>;

export type AssociationTypeProductSelection = {
  operator: 'AND' | 'OR';
  criteria: AssociationTypeProductSelectionCriterion[];
};

export type AssociationTypeProductSelectionCriterion = {
  field?: string;
  operator?: string;
  value?: unknown;
  scope?: string | null;
  locale?: string | null;
  options?: { [key: string]: unknown };
  criteria?: { [key: string]: unknown }[];
};

export type AssociationTypeConditionGroups = {
  operator: 'AND' | 'OR';
  conditions: AssociationTypeCondition[];
};

export type AssociationTypeCondition = {
  base_attribute: AssociationTypeConditionAttribute;
  operator: '=' | '>=' | '<=' | 'matches_any' | 'contains' | 'matches_all' | 'matches_exactly';
  compatible_attribute: AssociationTypeConditionAttribute;
};

export type AssociationTypeConditionAttribute = {
  attribute_code: string;
  scope?: string | null;
  locale?: string | null;
  record_attribute_code?: string | null;
};
