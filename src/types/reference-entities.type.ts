export type ReferenceEntity = {
  _links?: {
    image_download: {
      href: string;
    };
  };
  code: string;
  labels: { [localeCode: string]: string };
  image?: string;
};

export type ReferenceEntityAttribute = {
  code: string;
  labels: { [localeCode: string]: string };
  type: ReferenceEntityAttributeType;
  value_per_locale: boolean;
  value_per_channel: boolean;
  is_required_for_completeness: boolean;
  max_characters?: number | null;
  is_textarea?: boolean;
  is_rich_text_editor?: boolean;
  validation_rule?: string | null;
  validation_regexp?: string | null;
  allowed_extensions?: string[];
  max_file_size?: string | null;
  reference_entity_code?: string | null;
  asset_family_identifier?: string | null;
  decimals_allowed?: boolean;
  min_value?: string | null;
  max_value?: string | null;
};

export type ReferenceEntityAttributeOption = {
  code: string;
  labels: { [localeCode: string]: string };
};

export type ReferenceEntityRecord = {
  code: string;
  values: { [attributeCode: string]: ReferenceEntityRecordValue[] };
  created: string | null;
  updated: string | null;
};

export type ReferenceEntityRecordValue = {
  locale?: string | null;
  channel?: string | null;
  data: string | number | boolean | object | string[];
};

export enum ReferenceEntityAttributeType {
  IMAGE = 'image',
  TEXT = 'text',
  NUMBER = 'number',
  RECORD = 'reference_entity_single_link',
  RECORD_COLLECTION = 'reference_entity_multiple_links',
  OPTION = 'single_option',
  OPTION_COLLECTION = 'multiple_options',
  ASSET_COLLECTION = 'asset_collection',
}
