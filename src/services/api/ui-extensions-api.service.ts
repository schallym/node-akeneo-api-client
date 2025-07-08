import { UIExtension } from '../../types';
import { AkeneoApiClient } from '../akeneo-api-client';

export type CreateUIExtensionRequest = Partial<
  Omit<UIExtension, 'uuid' | 'name' | 'position' | 'type' | 'configuration'>
> &
  Required<Pick<UIExtension, 'name' | 'position' | 'type' | 'configuration'>>;

export type UpdateUIExtensionRequest = Partial<Omit<UIExtension, 'uuid'>> & Required<Pick<UIExtension, 'uuid'>>;

export class UIExtensionsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/ui-extensions';
  }

  async list(): Promise<UIExtension[]> {
    return this.client.httpClient.get(this.endpoint).then((response) => response.data);
  }

  async create(data: CreateUIExtensionRequest): Promise<UIExtension> {
    return this.client.httpClient.post(this.endpoint, data).then((response) => response.data);
  }

  async update(data: UpdateUIExtensionRequest): Promise<UIExtension> {
    return this.client.httpClient.patch(`${this.endpoint}/${data.uuid}`, data).then((response) => response.data);
  }

  async delete(id: string): Promise<void> {
    await this.client.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
