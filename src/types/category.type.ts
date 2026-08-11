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
