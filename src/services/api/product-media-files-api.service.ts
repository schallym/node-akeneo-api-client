import { AkeneoApiClient } from '../';
import { PaginatedResponse, ProductMediaFileType } from '../../types';

export type ProductMediaFilesSearchParams = {
  page?: number;
  limit?: number;
  with_count?: boolean;
};

export type CreateProductMediaFileRequest = {
  product?: {
    identifier: string;
    attribute: string;
    scope: string | null;
    locale: string | null;
  };
  product_model?: {
    code: string;
    attribute: string;
    scope: string | null;
    locale: string | null;
  };
  file: Blob | string;
};

export class ProductMediaFilesApi {
  private readonly endpoint = '/api/rest/v1/media-files';

  constructor(private readonly client: AkeneoApiClient) {}

  async get(code: string): Promise<ProductMediaFileType> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  async list(params?: ProductMediaFilesSearchParams): Promise<PaginatedResponse<ProductMediaFileType>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  async create(data: CreateProductMediaFileRequest): Promise<void> {
    const formData = new FormData();
    if (data.product) {
      formData.append('product', JSON.stringify(data.product));
    }
    if (data.product_model) {
      formData.append('product_model', JSON.stringify(data.product_model));
    }
    formData.append('file', data.file);

    await this.client.httpClient.post(this.endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async download(code: string): Promise<ArrayBuffer> {
    return this.client.httpClient
      .get(`${this.endpoint}/${code}/download`, { responseType: 'arraybuffer' })
      .then((response) => response.data);
  }
}
