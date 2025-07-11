export type HttpHook = {
  hookType: HttpHookType;
  failureMode: HttpHookFailureMode;
  endpoint: string;
  secret?: string;
  headers?: Record<string, string>;
};

export enum HttpHookType {
  PRODUCT_PRE_SAVE = 'product.preSave',
  PRODUCT_PRE_LOAD = 'product.preLoad',
}

export enum HttpHookFailureMode {
  REJECT_SAVE = 'reject-save',
  ALLOW_SAVE = 'allow-save',
}
