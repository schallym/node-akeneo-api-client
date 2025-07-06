import { ReferenceEntitiesMediaFilesApi } from './reference-entities-media-files-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';

describe('ReferenceEntitiesMediaFilesApi', () => {
  const mockHttpClient = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ReferenceEntitiesMediaFilesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ReferenceEntitiesMediaFilesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('create', () => {
    it('should send POST request with FormData', async () => {
      mockHttpClient.post.mockResolvedValue({});
      const data = { code: 'file1', file: 'file-content' };

      await api.create(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/rest/v1/reference-entities-media-files',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Bad request'));

      await expect(api.create({ code: 'bad', file: 'file' })).rejects.toThrow('Bad request');
    });
  });

  describe('download', () => {
    it('should fetch file as arraybuffer', async () => {
      const mockBuffer = new ArrayBuffer(8);
      mockHttpClient.get.mockResolvedValue({ data: mockBuffer });

      const result = await api.download('file1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities-media-files/file1', {
        responseType: 'arraybuffer',
      });
      expect(result).toBe(mockBuffer);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.download('bad')).rejects.toThrow('Not found');
    });
  });
});
