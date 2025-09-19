import { AkeneoApiClient } from '../../akeneo-api-client';

export type CreateAssetMediaFileRequest = {
  file: Blob | File;
  fileName?: string;
};

export type CreateAssetMediaFileResponse = {
  location: string;
  mediaFileCode: string;
};

export class AssetMediaFilesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/asset-media-files';
  }

  async create(data: CreateAssetMediaFileRequest): Promise<CreateAssetMediaFileResponse> {
    const formData = new FormData();
    formData.append('file', data.file, data.fileName);

    const response = await this.client.httpClient.post(`${this.endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      location: response.headers.location,
      mediaFileCode: response.headers['asset-media-file-code'],
    };
  }

  async download(code: string): Promise<ArrayBuffer> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`, { responseType: 'arraybuffer' }).then((response) => {
      return response.data;
    });
  }
}
