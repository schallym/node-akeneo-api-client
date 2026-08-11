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
  max_characters?: number | null;
  validation_rule?: string | null;
  validation_regexp?: string | null;
  wysiwyg_enabled?: boolean | null;
  number_min?: string | null;
  number_max?: string | null;
  decimals_allowed?: boolean | null;
  negative_allowed?: boolean | null;
  metric_family?: string | null;
  default_metric_unit?: string | null;
  date_min?: string | null;
  date_max?: string | null;
  display_time?: boolean | null;
  allowed_extensions?: string[];
  max_file_size?: string | null;
  reference_data_name?: string | null;
  default_value?: boolean | number | string | string[] | null;
  table_configuration?: Array<{
    code: string;
    data_type: string;
    validations: Record<string, any>;
    labels: { [localCode: string]: string };
    is_required_for_completeness: boolean;
  }>;
  is_main_identifier?: boolean;
  is_mandatory?: boolean;
  decimal_places_strategy?: 'round' | 'forbid' | 'trim' | null;
  decimal_places?: number | null;
  enable_option_creation_during_import?: boolean | null;
  max_items_count?: number | null;
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
  REFERENCE_DATA_SIMPLE_SELECT = 'pim_reference_data_simpleselect',
  REFERENCE_DATA_MULTI_SELECT = 'pim_reference_data_multiselect',
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
