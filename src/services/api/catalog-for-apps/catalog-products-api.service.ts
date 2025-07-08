import { AkeneoApiClient } from '../../akeneo-api-client';
import {
  MappedProduct,
  MappedProductModel,
  MappedProductModelVariant,
  PaginatedResponse,
  ProductUuid,
} from '../../../types';

export type CatalogProductUuidsSearchParams = {
  search_after?: string;
  limit?: number;
  updated_before?: string;
  updated_after?: string;
  with_count?: boolean;
};

export type CatalogProductsSearchParams = {
  search_after?: string;
  limit?: number;
  updated_before?: string;
  updated_after?: string;
};

export class CatalogProductsApi {
  private endpoint: string;

  constructor(private client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/catalogs/{id}';
  }

  async listProductUuids(
    catalogId: string,
    params?: CatalogProductUuidsSearchParams,
  ): Promise<PaginatedResponse<string>> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(catalogId)}/products/uuids`, { params })
      .then((response) => response.data);
  }

  async listProducts(catalogId: string, params?: CatalogProductsSearchParams): Promise<PaginatedResponse<ProductUuid>> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(catalogId)}/products`, { params })
      .then((response) => response.data);
  }

  async getProduct(catalogId: string, productUuid: string): Promise<ProductUuid> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(catalogId)}/products/${productUuid}`)
      .then((response) => response.data);
  }

  async listMappedProducts(
    catalogId: string,
    params?: CatalogProductsSearchParams,
  ): Promise<PaginatedResponse<MappedProduct>> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(catalogId)}/mapped-products`, { params })
      .then((response) => response.data);
  }

  async listMappedModels(
    catalogId: string,
    params?: CatalogProductsSearchParams,
  ): Promise<PaginatedResponse<MappedProductModel>> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(catalogId)}/mapped-models`, { params })
      .then((response) => response.data);
  }

  async listMappedModelVariants(
    catalogId: string,
    modelCode: string,
    params?: CatalogProductsSearchParams,
  ): Promise<PaginatedResponse<MappedProductModelVariant>> {
    return this.client.httpClient
      .get(`${this.completeEndpoint(catalogId)}/mapped-models/${modelCode}/variants`, { params })
      .then((response) => response.data);
  }

  private completeEndpoint(catalogId: string): string {
    return this.endpoint.replace('{id}', catalogId);
  }
}
