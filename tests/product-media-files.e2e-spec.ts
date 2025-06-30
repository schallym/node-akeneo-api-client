import nock from 'nock';
import { AkeneoApiClient } from '../src/services';
import { CreateProductMediaFileRequest, ProductMediaFilesApi } from '../src/services/api';
import { ProductMediaFileType } from '../src/types';
import productMediaFilesMock from './mocks/product-media-files.mock';

describe('ProductMediaFilesApi E2E', () => {
  const baseUrl = 'https://akeneo.test';
  let akeneoClient: AkeneoApiClient;
  let mediaFilesApi: ProductMediaFilesApi;

  beforeAll(() => {
    akeneoClient = new AkeneoApiClient({
      baseUrl,
      username: 'test_user',
      password: 'test_password',
      clientId: 'client_id',
      secret: 'secret',
    });
    mediaFilesApi = new ProductMediaFilesApi(akeneoClient);
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
    nock(baseUrl).post('/api/oauth/v1/token').reply(200, {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expires_in: 3600,
    });
  });

  it('should create a new media file', async () => {
    nock(baseUrl).post('/api/rest/v1/media-files').reply(201);

    const data: CreateProductMediaFileRequest = {
      product: 'test-product',
      file: 'file-content',
    };

    await expect(mediaFilesApi.create(data)).resolves.toBeUndefined();
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

    const result = await mediaFilesApi.list({ page: 1, limit: 10 });
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

    const result = await mediaFilesApi.get('media_1');
    expect(result).toEqual(mockMediaFile);
  });

  it('should download a media file', async () => {
    nock(baseUrl).get('/api/rest/v1/media-files/media_1/download').reply(200, productMediaFilesMock.download);

    const result = await mediaFilesApi.download('media_1');
    expect(result).toBeInstanceOf(Buffer);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).get('/api/rest/v1/media-files/nonexistent').reply(404, { code: 404, message: 'Not found' });

    await expect(mediaFilesApi.get('nonexistent')).rejects.toThrow();
  });
});
