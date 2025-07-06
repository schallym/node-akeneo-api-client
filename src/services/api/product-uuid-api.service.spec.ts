import { ProductsUuidApi, UpdateProductUuidRequest } from './product-uuid-api.service';
import { AkeneoApiClient } from '../';
import { ProductUuid } from '../../types';

jest.mock('../akeneo-api-client');

describe('ProductsUuidApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ProductsUuidApi;
  const testUuid = 'abc123-def456-ghi789';

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ProductsUuidApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correctly formatted data', async () => {
      const products: UpdateProductUuidRequest[] = [
        { uuid: 'uuid1', values: { name: [{ locale: null, scope: null, data: 'Product 1' }] } },
        { uuid: 'uuid2', values: { name: [{ locale: null, scope: null, data: 'Product 2' }] } },
      ];

      const mockResponseData =
        '{"line":1,"uuid":"uuid1","status_code":201,"message":"Created"}\n' +
        '{"line":2,"uuid":"uuid2","status_code":201,"message":"Created"}';

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(products);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/products-uuid',
        JSON.stringify(products[0]) + '\n' + JSON.stringify(products[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, uuid: 'uuid1', status_code: 201, message: 'Created' },
        { line: 2, uuid: 'uuid2', status_code: 201, message: 'Created' },
      ]);
    });
  });

  describe('submitDraftForApproval', () => {
    it('should send POST request to submit draft', async () => {
      mockHttpClient.post.mockResolvedValue({ data: {} });

      await api.submitDraftForApproval(testUuid);

      expect(mockHttpClient.post).toHaveBeenCalledWith(`/api/rest/v1/products-uuid/${testUuid}/proposal`, {});
    });
  });

  describe('getDraft', () => {
    it('should send GET request and return draft product', async () => {
      const mockProduct: ProductUuid = {
        uuid: testUuid,
        family: 'test_family',
        enabled: true,
        categories: ['category1'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProduct });

      const result = await api.getDraft(testUuid);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/products-uuid/${testUuid}/draft`);

      expect(result).toEqual(mockProduct);
    });
  });

  describe('inherited BaseApi methods', () => {
    it('should use the correct endpoint for get method', async () => {
      const mockProduct: ProductUuid = {
        uuid: testUuid,
        family: 'test_family',
        enabled: true,
        categories: ['category1'],
        groups: ['group1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProduct });

      await api.get(testUuid);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/products-uuid/${testUuid}`, {});
    });

    it('should use the correct endpoint for update method', async () => {
      const updateData: UpdateProductUuidRequest = {
        uuid: 'testUuid',
        values: { name: [{ locale: 'en_US', scope: null, data: 'Updated Product' }] },
      };

      mockHttpClient.patch.mockResolvedValue({ data: {} });

      await api.update(testUuid, updateData);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/api/rest/v1/products-uuid/${testUuid}`, updateData);
    });
  });
});
