import { MappingSchemasApi } from './mapping-schemas-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { MappingSchemaForProducts } from '../../../types';

describe('MappingSchemasApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  const mockClient = {
    httpClient: mockHttpClient,
  } as unknown as AkeneoApiClient;

  let api: MappingSchemasApi;
  const catalogId = 'catalog-123';
  const mockSchema: MappingSchemaForProducts = {
    $id: 'https://example.com/product',
    $schema: 'https://api.akeneo.com/mapping/product/1.0.0/schema',
    type: 'object',
    properties: {
      code: {
        title: 'Model ID',
        type: 'string',
      },
      brand: {
        title: 'Brand name',
        type: 'string',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api = new MappingSchemasApi(mockClient);
  });

  it('should get mapping schema for products', async () => {
    mockHttpClient.get.mockResolvedValue({ data: mockSchema });

    const result = await api.getForProducts(catalogId);
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs/catalog-123/mapping-schemas/product');
    expect(result).toEqual(mockSchema);
  });

  it('should update or create mapping schema for products', async () => {
    mockHttpClient.put.mockResolvedValue({});

    await expect(api.updateOrCreateForProducts(catalogId, mockSchema)).resolves.toBeUndefined();
    expect(mockHttpClient.put).toHaveBeenCalledWith(
      '/api/rest/v1/catalogs/catalog-123/mapping-schemas/product',
      mockSchema,
    );
  });

  it('should delete mapping schema for products', async () => {
    mockHttpClient.delete.mockResolvedValue({});

    await expect(api.deleteForProducts(catalogId)).resolves.toBeUndefined();
    expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/rest/v1/catalogs/catalog-123/mapping-schemas/product');
  });
});
