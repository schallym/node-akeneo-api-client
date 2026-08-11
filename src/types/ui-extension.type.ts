export type UIExtension = {
  uuid?: string;
  name: string;
  description?: string;
  version?: string;
  position: UIExtensionPosition;
  type: UIExtensionType;
  configuration: UIExtensionConfiguration;
  status: 'active' | 'inactive';
  credentials?: UIExtensionCredential[];
};

export type UIExtensionConfiguration = {
  default_label?: string;
  labels?: { [locale: string]: string };
  secret?: string;
  url?: string;
  file?: string;
  custom_variables?: { [key: string]: unknown };
};

export type UIExtensionCredential =
  UIExtensionCustomHeaderCredential | UIExtensionBearerTokenCredential | UIExtensionBasicAuthCredential;

export type UIExtensionCustomHeaderCredential = {
  code?: string;
  type: 'Custom Header';
  value: {
    header_key: string;
    header_value: string;
  };
};

export type UIExtensionBearerTokenCredential = {
  code?: string;
  type: 'Bearer Token';
  value: string;
};

export type UIExtensionBasicAuthCredential = {
  code?: string;
  type: 'Basic Auth';
  value: {
    username: string;
    password: string;
  };
};

export enum UIExtensionType {
  LINK = 'link',
  ACTION = 'action',
  IFRAME = 'iframe',
}

export enum UIExtensionPosition {
  PRODUCT_HEADER = 'pim.product.header',
  PRODUCT_MODEL_HEADER = 'pim.product-model.header',
  SUB_PRODUCT_MODEL_HEADER = 'pim.sub-product-model.header',
  PRODUCT_TAB = 'pim.product.tab',
  PRODUCT_MODEL_TAB = 'pim.product-model.tab',
  SUB_PRODUCT_MODEL_TAB = 'pim.sub-product-model.tab',
  CATEGORY_TAB = 'pim.category.tab',
  PRODUCT_GRID_ACTION_BAR = 'pim.product-grid.action-bar',
  ACTIVITY_NAVIGATION_TAB = 'pim.activity.navigation.tab',
}
