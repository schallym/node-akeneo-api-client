import { ProductsApi, UpdateProductRequest } from './products-api.service';
import { AkeneoApiClient } from '../';
import { Product } from '../../types';

jest.mock('../akeneo-api-client');

describe('ProductsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ProductsApi;
  const testIdentifier = 'test_product_123';

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ProductsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should send GET request with correct identifier', async () => {
      const mockProduct: Product = {
        uuid: '1234-5678-9012',
        identifier: testIdentifier,
        enabled: true,
        categories: ['category1', 'category2'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        family: 'test_family',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProduct });

      const result = await api.get(testIdentifier);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/products/${testIdentifier}`, {});
      expect(result).toEqual(mockProduct);
    });

    it('should send GET request with additional parameters', async () => {
      const mockProduct: Product = {
        uuid: '1234-5678-9012',
        identifier: testIdentifier,
        enabled: true,
        categories: ['category1', 'category2'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        family: 'test_family',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProduct });

      const result = await api.get(testIdentifier, { with_attribute_options: true });

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/products/${testIdentifier}`, {
        params: { with_attribute_options: true },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('list', () => {
    it('should send GET request with correct endpoint', async () => {
      const mockProduct: Product = {
        uuid: '1234-5678-9012',
        identifier: testIdentifier,
        enabled: true,
        categories: ['category1', 'category2'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        family: 'test_family',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: { items: [mockProduct], count: 1 } });

      const result = await api.list();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/products', {});
      expect(result).toEqual({ items: [mockProduct], count: 1 });
    });

    it('should send GET request with search parameters', async () => {
      const mockProduct: Product = {
        uuid: '1234-5678-9012',
        identifier: testIdentifier,
        enabled: true,
        categories: ['category1', 'category2'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        family: 'test_family',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: { items: [mockProduct], count: 1 } });

      const result = await api.list({ search: 'Test', limit: 10 });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/products', {
        params: { search: 'Test', limit: 10 },
      });
      expect(result).toEqual({ items: [mockProduct], count: 1 });
    });
  });

  describe('update', () => {
    it('should send PATCH request with correct identifier and data', async () => {
      const mockProduct: UpdateProductRequest = {
        identifier: testIdentifier,
        values: { name: [{ locale: 'en_US', scope: null, data: 'Updated Product' }] },
      };

      mockHttpClient.patch.mockResolvedValue({ data: {} });

      await api.update(testIdentifier, mockProduct);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/api/rest/v1/products/${testIdentifier}`, mockProduct);
    });
  });

  describe('create', () => {
    it('should send POST request with correct data', async () => {
      const mockProduct: Product = {
        uuid: '1234-5678-9012',
        identifier: testIdentifier,
        enabled: true,
        categories: ['category1', 'category2'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        family: 'test_family',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'New Product' }],
        },
      };

      mockHttpClient.post.mockResolvedValue({ data: {} });

      await api.create(mockProduct);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/products', mockProduct);
    });
  });

  describe('delete', () => {
    it('should send DELETE request with correct identifier', async () => {
      mockHttpClient.delete.mockResolvedValue({ data: {} });

      await api.delete(testIdentifier);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/rest/v1/products/${testIdentifier}`);
    });
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correctly formatted data', async () => {
      const products: Partial<Product>[] = [
        { identifier: 'prod1', values: { name: [{ locale: null, scope: null, data: 'Product 1' }] } },
        { identifier: 'prod2', values: { name: [{ locale: null, scope: null, data: 'Product 2' }] } },
      ];

      const mockResponseData =
        '{"line":1,"identifier":"prod1","status_code":201,"message":"Created"}\n' +
        '{"line":2,"identifier":"prod2","status_code":201,"message":"Created"}';

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(products);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        `/api/rest/v1/products`,
        JSON.stringify(products[0]) + '\n' + JSON.stringify(products[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );
      expect(result).toEqual([
        { line: 1, identifier: 'prod1', status_code: 201, message: 'Created' },
        { line: 2, identifier: 'prod2', status_code: 201, message: 'Created' },
      ]);
    });
  });

  describe('submitDraftForApproval', () => {
    it('should send POST request to submit draft', async () => {
      mockHttpClient.post.mockResolvedValue({ data: {} });

      await api.submitDraftForApproval(testIdentifier);

      expect(mockHttpClient.post).toHaveBeenCalledWith(`/api/rest/v1/products/${testIdentifier}/proposal`, {});
    });
  });

  describe('getDraft', () => {
    it('should send GET request and return draft product', async () => {
      const mockProduct: Product = {
        uuid: '1234-5678-9012',
        identifier: testIdentifier,
        enabled: true,
        categories: ['category1', 'category2'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        family: 'test_family',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProduct });

      const result = await api.getDraft(testIdentifier);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/products/${testIdentifier}/draft`);

      expect(result).toEqual(mockProduct);
    });
  });
});
