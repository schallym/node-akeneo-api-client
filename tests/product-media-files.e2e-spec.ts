import nock from 'nock';
import { CreateProductMediaFileRequest } from '../src/services/api';
import { ProductMediaFileType } from '../src/types';
import productMediaFilesMock from './mocks/product-media-files.mock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('ProductMediaFilesApi E2E', () => {
  let akeneoClient: AkeneoClient;

  beforeAll(() => {
    akeneoClient = setupAkeneoClient();
  });

  afterAll(() => {
    teardownNock();
  });

  beforeEach(() => {
    setupNock();
  });

  it('should create a new media file', async () => {
    nock(baseUrl).post('/api/rest/v1/media-files').reply(201);

    const data: CreateProductMediaFileRequest = {
      product: 'test-product',
      file: 'file-content',
    };

    await expect(akeneoClient.productMediaFiles.create(data)).resolves.toBeUndefined();
  });

  it('should list media files', async () => {
    const mockResponse = {
      _embedded: {
        items: [
          {
            code: 'media_1',
            original_filename: 'img.jpg',
            mime_type: 'image/jpeg',
            size: 123,
            extension: 'jpg',
            _links: {},
          },
        ],
      },
      current_page: 1,
      _links: {},
      items_count: 1,
    };

    nock(baseUrl).get('/api/rest/v1/media-files').query({ page: 1, limit: 10 }).reply(200, mockResponse);

    const result = await akeneoClient.productMediaFiles.list({ page: 1, limit: 10 });
    expect(result).toEqual(mockResponse);
  });

  it('should fetch a media file by code', async () => {
    const mockMediaFile: ProductMediaFileType = {
      code: 'media_1',
      original_filename: 'img.jpg',
      mime_type: 'image/jpeg',
      size: 123,
      extension: 'jpg',
      _links: {
        download: {
          href: 'https://akeneo.test/api/rest/v1/media-files/media_1/download',
        },
      },
    };

    nock(baseUrl).get('/api/rest/v1/media-files/media_1').reply(200, productMediaFilesMock.get);

    const result = await akeneoClient.productMediaFiles.get('media_1');
    expect(result).toEqual(mockMediaFile);
  });

  it('should download a media file', async () => {
    nock(baseUrl).get('/api/rest/v1/media-files/media_1/download').reply(200, productMediaFilesMock.download);

    const result = await akeneoClient.productMediaFiles.download('media_1');
    expect(result).toBeInstanceOf(Buffer);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).get('/api/rest/v1/media-files/nonexistent').reply(404, { code: 404, message: 'Not found' });

    await expect(akeneoClient.productMediaFiles.get('nonexistent')).rejects.toThrow();
  });
});
