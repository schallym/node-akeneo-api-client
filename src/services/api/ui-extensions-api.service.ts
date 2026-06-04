import { UIExtension } from '../../types';
import { AkeneoApiClient } from '../akeneo-api-client';

export type CreateUIExtensionRequest = Partial<
  Omit<UIExtension, 'uuid' | 'name' | 'position' | 'type' | 'configuration'>
> &
  Required<Pick<UIExtension, 'name' | 'position' | 'type' | 'configuration'>>;

export type UpdateUIExtensionRequest = Partial<Omit<UIExtension, 'uuid'>> & Required<Pick<UIExtension, 'uuid'>>;

export type UploadUIExtensionRequest = {
  file?: Blob | File;
  fileName?: string;
  name?: string;
  type?: string;
  position?: string;
  version?: string;
  description?: string;
  configuration?: {
    default_label?: string;
    labels?: { [locale: string]: string };
    custom_variables?: string;
  };
  credentials?: { code?: string; type?: string; value?: string }[];
};

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

  async uploadFile(uuid: string, data: UploadUIExtensionRequest): Promise<UIExtension> {
    const formData = this.buildUploadFormData(data);

    return this.client.httpClient
      .post(`${this.endpoint}/${uuid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data);
  }

  private buildUploadFormData(data: UploadUIExtensionRequest): FormData {
    const formData = new FormData();

    if (data.file) {
      if (data.fileName) {
        formData.append('file', data.file, data.fileName);
      } else {
        formData.append('file', data.file);
      }
    }

    for (const key of ['name', 'type', 'position', 'version', 'description'] as const) {
      const value = data[key];
      if (typeof value === 'string') {
        formData.append(key, value);
      }
    }

    if (data.configuration) {
      const config = data.configuration;
      if (config.default_label !== undefined) formData.append('configuration[default_label]', config.default_label);
      if (config.custom_variables !== undefined)
        formData.append('configuration[custom_variables]', config.custom_variables);
      const labels: { [locale: string]: string } = config.labels ?? {};
      for (const locale of Object.keys(labels)) {
        formData.append(`configuration[labels][${locale}]`, labels[locale]);
      }
    }

    (data.credentials ?? []).forEach((credential, index) => {
      if (credential.code !== undefined) formData.append(`credentials[${index}][code]`, credential.code);
      if (credential.type !== undefined) formData.append(`credentials[${index}][type]`, credential.type);
      if (credential.value !== undefined) formData.append(`credentials[${index}][value]`, credential.value);
    });

    return formData;
  }
}
