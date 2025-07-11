import { AkeneoApiClient } from '../akeneo-api-client';
import { HttpHook, HttpHookType } from '../../types';

export type CreateOrUpdateHttpHook = Partial<Omit<HttpHook, 'hookType'>> & Required<Pick<HttpHook, 'hookType'>>;

export class HttpHooksApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/http-hook';
  }

  async list(): Promise<HttpHook[]> {
    return this.client.httpClient.get(this.endpoint).then((response) => response.data);
  }

  async createOrUpdate(hook: CreateOrUpdateHttpHook): Promise<void> {
    await this.client.httpClient.put(this.endpoint, hook);
  }

  async delete(hookType: HttpHookType): Promise<void> {
    await this.client.httpClient.delete(`${this.endpoint}/${hookType}`);
  }
}
