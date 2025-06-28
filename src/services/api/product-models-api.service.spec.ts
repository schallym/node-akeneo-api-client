import { ProductModelsApi } from './product-models-api.service';
import AkeneoApiClient from '../akeneo-api-client';
import { ProductModel } from '../../types';

jest.mock('../akeneo-api-client');

describe('ProductModelsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ProductModelsApi;
  const testCode = 'test_product_model_123';

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ProductModelsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correctly formatted data', async () => {
      // Prepare test data
      const productModels = [
        {
          code: 'model1',
          family: 'shoes',
          family_variant: 'shoes_size',
          values: { color: [{ locale: null, scope: null, data: 'red' }] },
        },
        {
          code: 'model2',
          family: 'shoes',
          family_variant: 'shoes_size',
          values: { color: [{ locale: null, scope: null, data: 'blue' }] },
        },
      ];

      // Mock response
      const mockResponseData =
        '{"line":1,"code":"model1","status_code":201,"message":"Created"}\n' +
        '{"line":2,"code":"model2","status_code":201,"message":"Created"}';

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      // Call method
      const result = await api.updateOrCreateSeveral(productModels);

      // Verify HTTP call
      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/product-models',
        JSON.stringify(productModels[0]) + '\n' + JSON.stringify(productModels[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      // Verify result
      expect(result).toEqual([
        { line: 1, code: 'model1', status_code: 201, message: 'Created' },
        { line: 2, code: 'model2', status_code: 201, message: 'Created' },
      ]);
    });
  });

  describe('submitDraftForApproval', () => {
    it('should send POST request to submit draft', async () => {
      mockHttpClient.post.mockResolvedValue({ data: {} });

      await api.submitDraftForApproval(testCode);

      expect(mockHttpClient.post).toHaveBeenCalledWith(`/api/rest/v1/product-models/${testCode}/proposal`, {});
    });
  });

  describe('getDraft', () => {
    it('should send GET request and return draft product model', async () => {
      const mockProductModel: ProductModel = {
        code: testCode,
        family: 'test_family',
        family_variant: 'test_variant',
        groups: ['group1'],
        categories: ['category1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product Model' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProductModel });

      const result = await api.getDraft(testCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/product-models/${testCode}/draft`);

      expect(result).toEqual(mockProductModel);
    });
  });

  describe('inherited BaseApi methods', () => {
    it('should use the correct endpoint for get method', async () => {
      const mockProductModel: ProductModel = {
        code: testCode,
        family: 'test_family',
        family_variant: 'test_variant',
        groups: ['group1'],
        categories: ['category1'],
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-02T00:00:00Z',
        values: {
          name: [{ locale: 'en_US', scope: null, data: 'Test Product Model' }],
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProductModel });

      await api.get(testCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/product-models/${testCode}`, {});
    });

    it('should use the correct endpoint for update method', async () => {
      const updateData = {
        values: { name: [{ locale: 'en_US', scope: null, data: 'Updated Product Model' }] },
      };

      mockHttpClient.patch.mockResolvedValue({ data: {} });

      await api.update(testCode, updateData);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/api/rest/v1/product-models/${testCode}`, updateData);
    });
  });
});
