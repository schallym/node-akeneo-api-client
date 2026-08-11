export type Family = {
  code: string;
  labels: { [localCode: string]: string };
  attributes: string[];
  attribute_as_label: string;
  attribute_as_image?: string | null;
  attribute_requirements?: { [channelCode: string]: string[] };
  parent?: string | null;
};

export type VariantFamily = {
  code: string;
  common_attributes?: string[];
  variant_attribute_sets: {
    level: number;
    axes: string[];
    attributes: string[];
  }[];
  labels: { [localeCode: string]: string };
};
