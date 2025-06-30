import { CreateProductMediaFileRequest, ProductMediaFilesApi } from './product-media-files-api.service';
import { AkeneoApiClient } from '../';
import { ProductMediaFile } from '../../types';

jest.mock('../akeneo-api-client');

describe('ProductMediaFilesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ProductMediaFilesApi;
  const testCode = 'media_123';

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ProductMediaFilesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch a media file by code', async () => {
      const mockMediaFile: ProductMediaFile = {
        code: testCode,
        original_filename: 'image.jpg',
        mime_type: 'image/jpeg',
        size: 12345,
        extension: 'jpg',
        _links: {
          download: {
            href: '/api/rest/v1/media-files/media_123/download',
          },
        },
      };
      mockHttpClient.get.mockResolvedValue({ data: mockMediaFile });

      const result = await api.get(testCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/media-files/media_123');
      expect(result).toEqual(mockMediaFile);
    });
  });

  describe('list', () => {
    it('should list media files with params', async () => {
      const params = { page: 2, limit: 10, with_count: true };
      const mockResponse = { _embedded: { items: [] }, current_page: 2, _links: {}, items_count: 0 };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list(params);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/media-files', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should list media files without params', async () => {
      const mockResponse = { _embedded: { items: [] }, current_page: 1, _links: {}, items_count: 0 };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/media-files', { params: undefined });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new media file', async () => {
      const data: CreateProductMediaFileRequest = {
        product: 'prod1',
        file: 'file-content',
      };
      mockHttpClient.post.mockResolvedValue({});

      await api.create(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/media-files', data);
    });
  });

  describe('download', () => {
    it('should download a media file as ArrayBuffer', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      mockHttpClient.get.mockResolvedValue({ data: mockArrayBuffer });

      const result = await api.download(testCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/media-files/media_123/download', {
        responseType: 'arraybuffer',
      });
      expect(result).toBe(mockArrayBuffer);
    });
  });
});
