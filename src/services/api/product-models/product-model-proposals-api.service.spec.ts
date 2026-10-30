import { ProductModelProposalsApi } from './product-model-proposals-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { ProductModelProposal } from '../../../types';

describe('ProductModelProposalsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  const testCode = 'tshirt_cotton';
  let api: ProductModelProposalsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ProductModelProposalsApi(mockClient as unknown as AkeneoApiClient);
  });

  const author = 'mary';
  const mockProposal: ProductModelProposal = {
    product_model_code: testCode,
    author,
    created: '2026-10-27T09:12:38+00:00',
    values: {
      description: [{ locale: 'en_US', scope: 'ecommerce', data: 'A comfortable cotton t-shirt' }],
    },
  };

  it('should send GET request to list the product model proposals', async () => {
    const mockResponse = {
      _links: { self: { href: 'self' }, first: { href: 'first' } },
      current_page: 1,
      _embedded: { items: [mockProposal] },
    };
    mockHttpClient.get.mockResolvedValue({ data: mockResponse });

    const result = await api.list({ page: 2, limit: 50, with_count: true });

    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/product-model-proposals', {
      params: { page: 2, limit: 50, with_count: true },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should send GET request to retrieve a product model proposal', async () => {
    mockHttpClient.get.mockResolvedValue({ data: mockProposal });

    const result = await api.get(testCode, author);

    expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/product-model-proposals/${testCode}/${author}`);
    expect(result).toEqual(mockProposal);
  });

  it('should send DELETE request to delete a product model proposal', async () => {
    mockHttpClient.delete.mockResolvedValue({ data: undefined });

    await api.delete(testCode, author);

    expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/rest/v1/product-model-proposals/${testCode}/${author}`);
  });
});
