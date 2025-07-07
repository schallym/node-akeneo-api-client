export type AssetFamily = {
  code: string;
  labels?: { [localeCode: string]: string };
  attribute_as_main_media?: string;
  naming_convention?: AssetFamilyNamingConvention;
  product_link_rules?: AssetFamilyProductLinkRule[];
  transformations?: AssetFamilyTransformation[];
  sharing_enabled?: boolean;
};

export type AssetAttribute = {
  code: string;
  labels: { [localeCode: string]: string };
  type: AssetAttributeType;
  value_per_locale: boolean;
  value_per_channel: boolean;
  is_required_for_completeness: boolean;
  is_read_only: boolean;
  max_characters?: number;
  is_textarea?: boolean;
  is_rich_text_editor?: boolean;
  validation_rule?: string;
  validation_regexp?: string;
  allowed_extensions?: string[];
  max_file_size?: string;
  decimals_allowed?: boolean;
  min_value?: string;
  max_value?: string;
  media_type?: string;
  prefix?: string;
  suffix?: string;
  reference_entity?: string;
};

export type AssetAttributeOption = {
  code: string;
  labels?: { [localeCode: string]: string };
};

export type Asset = {
  code: string;
  values: { [attributeCode: string]: AssetValue[] };
  created: string;
  updated: string;
};

export type AssetValue = {
  locale: string | null;
  channel: string | null;
  data: string | number | boolean | object | string[];
};

export type AssetFamilyNamingConvention = {
  source: AssetFamilyAttributeDefinition;
  pattern: string;
  abort_asset_creation_on_error: boolean;
};

export type AssetFamilyAttributeDefinition = {
  property?: string;
  attribute?: string;
  locale: string | null;
  channel: string | null;
};

export type AssetFamilyProductLinkRule = {
  product_selections: AssetFamilyProductSelection[];
  assign_assets_to: AssetFamilyProductValueAssignment[];
};

export type AssetFamilyProductSelection = {
  field: string;
  operator: string;
  value: string;
  locale?: string | null;
  channel?: string | null;
};

export type AssetFamilyProductValueAssignment = {
  mode: string;
  attribute: string;
  locale?: string | null;
  channel?: string | null;
};

export type AssetFamilyTransformation = {
  label: string;
  filename_suffix?: string;
  filename_prefix?: string;
  source: AssetFamilyAttributeDefinition;
  target: AssetFamilyAttributeDefinition;
  operations?: AssetFamilyTransformationOperation[];
};

export type AssetFamilyTransformationOperation = {
  type: string;
  parameters: { [key: string]: any };
};

export enum AssetAttributeType {
  MEDIA_FILE = 'media_file',
  TEXT = 'text',
  NUMBER = 'number',
  SINGLE_OPTION = 'single_option',
  MULTIPLE_OPTIONS = 'multiple_options',
  MEDIA_LINK = 'media_link',
  BOOLEAN = 'boolean',
  DATE = 'date',
  RECORD = 'record',
}
