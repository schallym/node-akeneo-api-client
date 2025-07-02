export type Category = {
  code: string;
  parent?: string;
  updated: string;
  position?: number;
  labels: { [localeCode: string]: string };
  values: {
    [key: string]: CategoryValue[];
  };
  channel_requirements?: string[];
};

export type CategoryValue = {
  data: string | number | boolean | object;
  type: string;
  locale?: string | null;
  channel?: string | null;
  attribute_code?: string;
};
