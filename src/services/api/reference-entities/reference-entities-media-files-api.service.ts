import { AkeneoApiClient } from '../../akeneo-api-client';

export type CreateReferenceEntityMediaFileRequest = {
  file: Blob | File;
  fileName: string;
};

export type CreateReferenceEntityMediaFileResponse = {
  location: string;
  mediaFileCode: string;
};

export class ReferenceEntitiesMediaFilesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/reference-entities-media-files';
  }

  async create(data: CreateReferenceEntityMediaFileRequest): Promise<CreateReferenceEntityMediaFileResponse> {
    const formData = new FormData();
    formData.append('file', data.file, data.fileName);

    const response = await this.client.httpClient.post(`${this.endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      location: response.headers.location,
      mediaFileCode: response.headers['reference-entities-media-file-code'],
    };
  }

  async download(code: string): Promise<ArrayBuffer> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`, { responseType: 'arraybuffer' }).then((response) => {
      return response.data;
    });
  }
}
