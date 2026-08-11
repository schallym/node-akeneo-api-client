export type AssetFamily = {
  code: string;
  labels?: { [localeCode: string]: string };
  attribute_as_main_media?: string;
  naming_convention?: AssetFamilyNamingConvention;
  product_link_rules?: AssetFamilyProductLinkRule[];
  transformations?: AssetFamilyTransformation[];
  sharing_enabled?: boolean;
  auto_tagging_enabled?: boolean;
};

export type AssetAttribute = {
  code: string;
  labels: { [localeCode: string]: string };
  type: AssetAttributeType;
  value_per_locale: boolean;
  value_per_channel: boolean;
  is_required_for_completeness: boolean;
  is_read_only: boolean;
  max_characters?: number | null;
  is_textarea?: boolean;
  is_rich_text_editor?: boolean;
  validation_rule?: string | null;
  validation_regexp?: string | null;
  allowed_extensions?: string[];
  max_file_size?: string | null;
  decimals_allowed?: boolean;
  min_value?: string | null;
  max_value?: string | null;
  media_type?: string;
  prefix?: string | null;
  suffix?: string | null;
  reference_entity?: string | null;
  default_value?: string | boolean | string[] | null;
  asset_family_code?: string | null;
};

export type AssetAttributeOption = {
  code: string;
  labels?: { [localeCode: string]: string };
};

export type Asset = {
  code: string;
  asset_family_code?: string;
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
  ASSET_FAMILY_SINGLE_LINK = 'asset_family_single_link',
  ASSET_FAMILY_MULTIPLE_LINKS = 'asset_family_multiple_links',
  AUTO_TAGGING = 'auto_tagging',
}
