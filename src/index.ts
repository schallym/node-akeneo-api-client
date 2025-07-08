export * from './akeneo-client';

import { AkeneoAuthAppConfig, AkeneoAuthConnectionConfig } from './types';
import { AxiosRequestConfig } from 'axios';
import { AkeneoClient } from '../src';

export function createClient(
  config: AkeneoAuthConnectionConfig | AkeneoAuthAppConfig,
  axiosOption?: AxiosRequestConfig,
): AkeneoClient {
  return new AkeneoClient(config, axiosOption);
}
