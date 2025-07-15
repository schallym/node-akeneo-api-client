import { CategoriesApi } from './categories-api.service';
import { AkeneoApiClient } from '../';
import { Category } from '../../types';

describe('CategoriesApi', () => {
  const mockHttpClient = {
    patch: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: CategoriesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new CategoriesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const categories: Partial<Category>[] = [
        { code: 'cat1', labels: { en_US: 'C1' } },
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
