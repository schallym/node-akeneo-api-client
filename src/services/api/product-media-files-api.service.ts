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
    attributes: string;
    scope: string | null;
    locale: string | null;
  };
  product_model?: {
    code: string;
    attributes: string;
    scope: string | null;
    locale: string | null;
  };
  file: Blob | string;
};

export class ProductMediaFilesApi {
  private readonly endpoint = '/api/rest/v1/media-files';

  constructor(private readonly client: AkeneoApiClient) {}

  public async get(code: string): Promise<ProductMediaFileType> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((response) => response.data);
  }

  public async list(params?: ProductMediaFilesSearchParams): Promise<PaginatedResponse<ProductMediaFileType>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((response) => response.data);
  }

  public async create(data: CreateProductMediaFileRequest): Promise<void> {
    await this.client.httpClient.post(this.endpoint, data);
  }

  public async download(code: string): Promise<ArrayBuffer> {
    return this.client.httpClient
      .get(`${this.endpoint}/${code}/download`, { responseType: 'arraybuffer' })
      .then((response) => response.data);
  }
}
