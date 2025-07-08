// src/services/api/catalog-for-apps/catalog-products-api.service.spec.ts
import { CatalogProductsApi } from './catalog-products-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';

describe('CatalogProductsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
  };
  const mockClient = {
    httpClient: mockHttpClient,
  } as unknown as AkeneoApiClient;

  let api: CatalogProductsApi;
  const catalogId = 'catalog-123';
  const productUuid = 'uuid-456';
  const modelCode = 'model-789';

  beforeEach(() => {
    jest.clearAllMocks();
    api = new CatalogProductsApi(mockClient);
  });

  it('should list product uuids', async () => {
    const mockResponse = { items: ['uuid1', 'uuid2'], current_page: 1 };
    mockHttpClient.get.mockResolvedValue({ data: mockResponse });

    const result = await api.listProductUuids(catalogId, { limit: 10 });
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs/catalog-123/products/uuids', {
      params: { limit: 10 },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should list products', async () => {
    const mockResponse = { items: [{ uuid: 'uuid1' }], current_page: 1 };
    mockHttpClient.get.mockResolvedValue({ data: mockResponse });

    const result = await api.listProducts(catalogId, { limit: 5 });
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs/catalog-123/products', {
      params: { limit: 5 },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should get a product by uuid', async () => {
    const mockProduct = { uuid: productUuid, name: 'Product' };
    mockHttpClient.get.mockResolvedValue({ data: mockProduct });

    const result = await api.getProduct(catalogId, productUuid);
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs/catalog-123/products/uuid-456');
    expect(result).toEqual(mockProduct);
  });

  it('should list mapped products', async () => {
    const mockResponse = { items: [{ uuid: 'uuid1', mapped: true }], current_page: 1 };
    mockHttpClient.get.mockResolvedValue({ data: mockResponse });

    const result = await api.listMappedProducts(catalogId, { limit: 2 });
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs/catalog-123/mapped-products', {
      params: { limit: 2 },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should list mapped models', async () => {
    const mockResponse = { items: [{ code: 'model1' }], current_page: 1 };
    mockHttpClient.get.mockResolvedValue({ data: mockResponse });

    const result = await api.listMappedModels(catalogId, { limit: 3 });
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs/catalog-123/mapped-models', {
      params: { limit: 3 },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should list mapped model variants', async () => {
    const mockResponse = { items: [{ code: 'variant1' }], current_page: 1 };
    mockHttpClient.get.mockResolvedValue({ data: mockResponse });

    const result = await api.listMappedModelVariants(catalogId, modelCode, { limit: 4 });
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      '/api/rest/v1/catalogs/catalog-123/mapped-models/model-789/variants',
      { params: { limit: 4 } },
    );
    expect(result).toEqual(mockResponse);
  });
});
