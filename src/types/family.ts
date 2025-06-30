export type Family = {
  code: string;
  labels: { [key: string]: string };
  attributes: string[];
  attribute_as_label?: string;
  attribute_as_image?: string;
  attribute_requirements?: { [channelCode: string]: string[] };
};

export type VariantFamily = {
  code: string;
  variant_attribute_sets: {
    level: number;
    axes: string[];
    attributes: string[];
  }[];
  labels: { [localeCode: string]: string };
};
