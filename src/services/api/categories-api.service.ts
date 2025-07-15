import { AkeneoApiClient } from '../';
import { Category } from '../../types';
import { BaseApi } from './base-api.service';

export type CategoriesSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
  with_position?: boolean;
  with_enriched_attributes?: boolean;
};

export type CategoriesGetParams = {
  with_position?: boolean;
  with_enriched_attributes?: boolean;
};

export type CreateCategoryRequest = Partial<Omit<Category, 'code'>> & Required<Pick<Category, 'code'>>;

export type SeveralCategoriesUpdateOrCreationResponseLine = {
  line: number;
  code: string;
  status_code: number;
  message: string;
};

export type CreateCategoryMediaFileRequest = {
  category?: {
    code: string;
    attribute_code: string;
    locale?: string | null;
    channel?: string | null;
  };
  file: Blob | string;
};

export class CategoriesApi extends BaseApi<
  Category,
  CategoriesGetParams,
  CategoriesSearchParams,
  CreateCategoryRequest,
  Partial<Category>
> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/categories');
  }

  async delete(): Promise<void> {
    throw new Error('Method not implemented. Deletion of categories is not supported by the API.');
  }

  async updateOrCreateSeveral(data: Partial<Category>[]): Promise<SeveralCategoriesUpdateOrCreationResponseLine[]> {
    return this.client.httpClient
      .patch(`${this.endpoint}`, data.map((item) => JSON.stringify(item)).join('\n'), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      })
      .then((response) => {
        return (typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
          .trim()
          .split('\n')
          .map((line: string) => JSON.parse(line));
      });
  }

  async createCategoryMediaFile(data: CreateCategoryMediaFileRequest): Promise<void> {
    await this.client.httpClient.post('/api/rest/v1/category-media-files', data);
  }

  async downloadCategoryMediaFile(filePath: string): Promise<ArrayBuffer> {
    return this.client.httpClient
      .get(`/api/rest/v1/category-media-files/${filePath}/download`, {
        responseType: 'arraybuffer',
      })
      .then((response) => {
        return response.data;
      });
  }
}
