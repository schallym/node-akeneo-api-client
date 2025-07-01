export type AttributeGroup = {
  code: string;
  sort_order: number;
  attributes: string[];
  labels: { [localeCode: string]: string };
};
