export type Category = {
  code: string;
  parent?: string | null;
  updated: string;
  position?: number;
  labels: { [localeCode: string]: string };
  values: {
    [key: string]: CategoryValue;
  };
  channel_requirements?: string[];
  validations?: CategoryValidations;
};

export type CategoryValue = {
  data: string | number | boolean | object;
  type: string;
  locale?: string | null;
  channel?: string | null;
  attribute_code?: string;
};

export type CategoryValidations = {
  max_categories_per_product?: number;
  only_leaves?: boolean;
  is_mandatory?: boolean;
};

export type CategoryTemplateAttributeType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'boolean'
  | 'simple_select'
  | 'multi_select'
  | 'asset_collection'
  | 'product_and_product_model_sort'
  | 'datetime'
  | 'reference_entity'
  | 'reference_entity_collection';

export type CategoryTemplateAttributeOption = {
  code?: string;
  labels?: { [localeCode: string]: string | null };
};

export type CategoryTemplateAttribute = {
  code?: string;
  uuid?: string;
  type?: CategoryTemplateAttributeType;
  labels?: { [localeCode: string]: string | null };
  order?: number;
  is_required?: boolean;
  is_localizable?: boolean;
  is_scopable?: boolean;
  options?: CategoryTemplateAttributeOption[];
  default_value?: string | boolean | string[] | { [key: string]: unknown } | null;
  reference_entity?: string;
  asset_family?: string;
};

export type CategoryTemplate = {
  uuid?: string;
  code?: string;
  attributes?: CategoryTemplateAttribute[];
};
