export type Channel = {
  code: string;
  locales: string[];
  currencies: string[];
  category_tree: string;
  conversion_units?: {
    [attributeCode: string]: string | null;
  };
  labels?: {
    [localeCode: string]: string;
  };
};
