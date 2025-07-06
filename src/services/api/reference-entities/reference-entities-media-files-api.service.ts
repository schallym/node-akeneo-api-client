import { AkeneoApiClient } from '../../akeneo-api-client';

export type CreateReferenceEntityRecordRequest = {
  code: string;
  file: Blob | File | string;
};

export class ReferenceEntitiesMediaFilesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/reference-entities-media-files';
  }

  async create(data: CreateReferenceEntityRecordRequest): Promise<void> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('code', data.code);

    await this.client.httpClient.post(`${this.endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async download(code: string): Promise<ArrayBuffer> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`, { responseType: 'arraybuffer' }).then((response) => {
      return response.data;
    });
  }
}
