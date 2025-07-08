export type Catalog = {
  id: string;
  name: string;
  enabled: boolean;
  managed_currencies: string[];
  managed_locales: string[];
};

export type MappedProduct = {
  uuid: string;
  title: string;
  code: string;
};

export type MappedProductModel = {
  code: string;
  title: string;
  variants: string;
  variation_axes: {
    code: string;
    label: {
      locale: string;
      value: string;
    }[];
  }[];
};

export type MappedProductModelVariant = {
  is_published: boolean;
  sku: string;
  uuid: string;
  variant_axes_values: {
    code: string;
    label: {
      locale: string;
      value: string;
    }[];
    value: string;
  }[];
};

export type MappingSchemaForProducts = {
  $id: string;
  $schema: string;
  $comment?: string;
  title?: string;
  description?: string;
  type: 'object';
  properties: { [key: string]: any };
};
