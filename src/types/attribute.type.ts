export type Attribute = {
  code: string;
  type: AttributeTypes;
  labels: { [localCode: string]: string };
  group: string;
  group_labels: { [localCode: string]: string };
  sort_order: number;
  localizable: boolean;
  scopable: boolean;
  available_locales?: string[];
  unique?: boolean;
  useable_as_grid_filter?: boolean;
  max_characters?: number;
  validation_rule?: string;
  validation_regexp?: string;
  wysiwyg_enabled?: boolean;
  number_min?: string;
  number_max?: string;
  decimals_allowed?: boolean;
  negative_allowed?: boolean;
  metric_family?: string;
  default_metric_unit?: string;
  date_min?: string;
  date_max?: string;
  allowed_extensions?: string[];
  max_file_size?: string;
  reference_data_name?: string;
  default_value?: boolean;
  table_configuration?: Array<{
    code: string;
    data_type: string;
    validations: Record<string, any>;
    labels: { [localCode: string]: string };
    is_required_for_completeness: boolean;
  }>;
  is_main_identifier?: boolean;
  is_mandatory?: boolean;
  decimal_places_strategy?: 'round' | 'forbid' | 'trim';
  decimal_places?: number;
};

export enum AttributeTypes {
  TEXT = 'pim_catalog_text',
  TEXTAREA = 'pim_catalog_textarea',
  NUMBER = 'pim_catalog_number',
  BOOLEAN = 'pim_catalog_boolean',
  DATE = 'pim_catalog_date',
  IDENTIFIER = 'pim_catalog_identifier',
  SIMPLE_SELECT = 'pim_catalog_simpleselect',
  MULTI_SELECT = 'pim_catalog_multiselect',
  FILE = 'pim_catalog_file',
  IMAGE = 'pim_catalog_image',
  METRIC = 'pim_catalog_metric',
  REFERENCE_ENTITY = 'akeneo_reference_entity',
  REFERENCE_ENTITY_COLLECTION = 'akeneo_reference_entity_collection',
  TABLE = 'pim_catalog_table',
  ASSET_COLLECTION = 'pim_catalog_asset_collection',
  PRICE = 'pim_catalog_price_collection',
  PRODUCT_LINK = 'pim_catalog_product_link',
}

export type AttributeOption = {
  code: string;
  attribute: string;
  sort_order: number;
  labels: { [localeCode: string]: string };
};
