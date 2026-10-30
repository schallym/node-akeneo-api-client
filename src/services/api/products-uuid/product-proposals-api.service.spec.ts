import { ProductProposalsApi } from './product-proposals-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { ProductProposal } from '../../../types';

describe('ProductProposalsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  const testUuid = '25566245-8ed9-4f9c-b1d5-8f3a0b6f1d2a';
  let api: ProductProposalsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ProductProposalsApi(mockClient as unknown as AkeneoApiClient);
  });

  const author = 'mary';
  const mockProposal: ProductProposal = {
    product_uuid: testUuid,
    author,
    created: '2026-10-27T09:12:38+00:00',
    values: {
      description: [{ locale: 'en_US', scope: 'ecommerce', data: 'A comfortable cotton t-shirt' }],
    },
  };

  it('should send GET request to list the product proposals', async () => {
    const mockResponse = {
      _links: { self: { href: 'self' }, first: { href: 'first' } },
      current_page: 1,
      _embedded: { items: [mockProposal] },
    };
    mockHttpClient.get.mockResolvedValue({ data: mockResponse });

    const result = await api.list({ page: 2, limit: 50, with_count: true });

    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/product-proposals', {
      params: { page: 2, limit: 50, with_count: true },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should send GET request to retrieve a product proposal', async () => {
    mockHttpClient.get.mockResolvedValue({ data: mockProposal });

    const result = await api.get(testUuid, author);

    expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/product-proposals/${testUuid}/${author}`);
    expect(result).toEqual(mockProposal);
  });

  it('should send DELETE request to delete a product proposal', async () => {
    mockHttpClient.delete.mockResolvedValue({ data: undefined });

    await api.delete(testUuid, author);

    expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/rest/v1/product-proposals/${testUuid}/${author}`);
  });
});
