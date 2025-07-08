import { CatalogApi } from './catalogs-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { Catalog } from '../../../types';

describe('CatalogApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    post: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  } as unknown as AkeneoApiClient;

  let api: CatalogApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new CatalogApi(mockClient);
  });

  it('should get a catalog by id', async () => {
    const mockCatalog: Catalog = { id: '1', name: 'Test Catalog' } as Catalog;
    mockHttpClient.get.mockResolvedValue({ data: mockCatalog });

    const result = await api.get('1');
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs/1', { params: undefined });
    expect(result).toEqual(mockCatalog);
  });

  it('should list catalogs', async () => {
    const mockCatalogs: Catalog[] = [{ id: '1', name: 'A' } as Catalog, { id: '2', name: 'B' } as Catalog];
    mockHttpClient.get.mockResolvedValue({ data: { _embedded: { items: mockCatalogs } } });

    const result = await api.list();
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/catalogs', { params: undefined });
    expect(result).toEqual({ _embedded: { items: mockCatalogs } });
  });

  it('should update a catalog', async () => {
    const updateData = { name: 'Updated' };
    const updatedCatalog: Catalog = { id: '1', name: 'Updated' } as Catalog;
    mockHttpClient.patch.mockResolvedValue({ data: updatedCatalog });

    const result = await api.update('1', updateData);
    expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/catalogs/1', updateData);
    expect(result).toBeUndefined();
  });

  it('should remove a catalog', async () => {
    mockHttpClient.delete.mockResolvedValue({});

    await api.delete('1');
    expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/rest/v1/catalogs/1');
  });

  it('should duplicate a catalog', async () => {
    const mockCatalog: Catalog = { id: '1', name: 'Duplicated Catalog' } as Catalog;
    mockHttpClient.post.mockResolvedValue({ data: mockCatalog });

    const result = await api.duplicate('1');
    expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/catalogs/1/duplicate');
    expect(result).toEqual(mockCatalog);
  });
});
