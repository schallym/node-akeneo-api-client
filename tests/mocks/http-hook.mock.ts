import { HttpHook, HttpHookFailureMode, HttpHookType } from '../../src';

const httpHook: HttpHook = {
  hookType: HttpHookType.PRODUCT_PRE_SAVE,
  failureMode: HttpHookFailureMode.ALLOW_SAVE,
  endpoint: 'https://example.com/hook1',
};

export default {
  get: httpHook,
  list: [httpHook],
};
