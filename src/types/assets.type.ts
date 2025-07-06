export type AssetFamily = {
  code: string;
  labels?: { [localeCode: string]: string };
  attribute_as_main_media?: string;
  naming_convention?: AssetFamilyNamingConvention;
  product_link_rules?: AssetFamilyProductLinkRule[];
  transformations?: AssetFamilyTransformation[];
  sharing_enabled?: boolean;
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
