import { AssetMediaFilesApi, CreateAssetRecordRequest } from './asset-media-files-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';

describe('AssetMediaFilesApi', () => {
  const mockHttpClient = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: AssetMediaFilesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new AssetMediaFilesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('create', () => {
    it('should send a multipart/form-data POST request', async () => {
      const data: CreateAssetRecordRequest = { code: 'file1', file: new Blob(['test']) };
      mockHttpClient.post.mockResolvedValue({});

      await api.create(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/rest/v1/asset-media-files',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Content-Type': 'multipart/form-data' }),
        }),
      );
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Upload failed'));

      await expect(api.create({ code: 'bad', file: 'file' })).rejects.toThrow('Upload failed');
    });
  });

  describe('download', () => {
    it('should fetch an asset media file as ArrayBuffer', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      mockHttpClient.get.mockResolvedValue({ data: mockArrayBuffer });

      const result = await api.download('file1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-media-files/file1', {
        responseType: 'arraybuffer',
      });
      expect(result).toBe(mockArrayBuffer);
    });

    it('should handle errors when downloading', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Download failed'));

      await expect(api.download('bad')).rejects.toThrow('Download failed');
    });
  });
});
