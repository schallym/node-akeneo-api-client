import { CategoriesApi, CreateCategoryRequest } from './categories-api.service';
import { AkeneoApiClient } from '../';
import { Category } from '../../types';

describe('CategoriesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: CategoriesApi;

  const mockCategory: Category = {
    code: 'cat1',
    updated: '2025-01-01T00:00:00Z',
    labels: { en_US: 'Category 1' },
    values: {
      description: {
        data: 'A test category',
        type: 'text',
        locale: 'en_US',
        channel: null,
      },
    },
    channel_requirements: ['ecommerce', 'mobile'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api = new CategoriesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should send GET request with correct identifier', async () => {
      mockHttpClient.get.mockResolvedValue({ data: mockCategory });

      const result = await api.get('cat1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/categories/cat1', {});
      expect(result).toEqual(mockCategory);
      expect(result.channel_requirements).toEqual(['ecommerce', 'mobile']);
    });

    it('should send GET request with additional parameters', async () => {
      mockHttpClient.get.mockResolvedValue({ data: mockCategory });

      const result = await api.get('cat1', { with_position: true, with_enriched_attributes: true });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/categories/cat1', {
        params: { with_position: true, with_enriched_attributes: true },
      });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('list', () => {
    it('should send GET request with correct endpoint', async () => {
      const mockResponse = {
        _links: { self: { href: '' }, first: { href: '' } },
        current_page: 1,
        _embedded: { items: [mockCategory] },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/categories', {});
      expect(result._embedded.items).toHaveLength(1);
      expect(result._embedded.items[0].channel_requirements).toEqual(['ecommerce', 'mobile']);
    });

    it('should send GET request with search parameters', async () => {
      const mockResponse = {
        _links: { self: { href: '' }, first: { href: '' } },
        current_page: 1,
        _embedded: { items: [mockCategory] },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ search: 'cat', limit: 10, with_position: true });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/categories', {
        params: { search: 'cat', limit: 10, with_position: true },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('should send POST request with correct data', async () => {
      const data: CreateCategoryRequest = {
        code: 'new_cat',
        labels: { en_US: 'New Category' },
        channel_requirements: ['ecommerce'],
      };
      mockHttpClient.post.mockResolvedValue({ data: {} });

      await api.create(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/categories', data);
    });

    it('should send POST request without optional fields', async () => {
      const data: CreateCategoryRequest = { code: 'minimal_cat' };
      mockHttpClient.post.mockResolvedValue({ data: {} });

      await api.create(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/categories', data);
    });
  });

  describe('update', () => {
    it('should send PATCH request with correct identifier and data', async () => {
      const data: Partial<Category> = {
        labels: { en_US: 'Updated Category' },
        channel_requirements: ['ecommerce', 'print'],
      };
      mockHttpClient.patch.mockResolvedValue({ data: {} });

      await api.update('cat1', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/categories/cat1', data);
    });
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const categories: Partial<Category>[] = [
        { code: 'cat1', labels: { en_US: 'C1' }, channel_requirements: ['ecommerce'] },
        { code: 'cat2', labels: { en_US: 'C2' } },
      ];

      const mockResponseData = [
        JSON.stringify({ line: 1, code: 'cat1', status_code: 200, message: 'ok' }),
        JSON.stringify({ line: 2, code: 'cat2', status_code: 201, message: 'created' }),
      ].join('\n');

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(categories);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/categories',
        JSON.stringify(categories[0]) + '\n' + JSON.stringify(categories[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, code: 'cat1', status_code: 200, message: 'ok' },
        { line: 2, code: 'cat2', status_code: 201, message: 'created' },
      ]);
    });

    it('should send PATCH request with correct data and parse response with non string response', async () => {
      const categories: Partial<Category>[] = [{ code: 'cat1', labels: { en_US: 'C1' } }];

      const mockResponseData = { line: 1, code: 'cat1', status_code: 200, message: 'ok' };

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(categories);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/categories', JSON.stringify(categories[0]), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      });

      expect(result).toEqual([mockResponseData]);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow('Bad request');
    });
  });

  describe('delete', () => {
    it('should throw an error when trying to delete a category', async () => {
      await expect(api.delete()).rejects.toThrow(
        'Method not implemented. Deletion of categories is not supported by the API.',
      );
    });
  });

  describe('createCategoryMediaFile', () => {
    it('should send POST request to create a category media file', async () => {
      const data = { category: { code: 'cat1', attribute_code: 'image' }, file: 'filedata' };
      mockHttpClient.post.mockResolvedValue({});

      await api.createCategoryMediaFile(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/category-media-files', data);
    });
  });

  describe('downloadCategoryMediaFile', () => {
    it('should send GET request and return ArrayBuffer', async () => {
      const filePath = 'somefile.png';
      const mockArrayBuffer = new ArrayBuffer(8);
      mockHttpClient.get.mockResolvedValue({ data: mockArrayBuffer });

      const result = await api.downloadCategoryMediaFile(filePath);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/rest/v1/category-media-files/${filePath}/download`, {
        responseType: 'arraybuffer',
      });
      expect(result).toBe(mockArrayBuffer);
    });
  });
});
