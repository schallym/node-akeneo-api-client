// tests/asset-families.e2e-spec.ts
import nock from 'nock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import assetManagerMock from './mocks/asset-manager.mock';

describe('AssetManagerApi', () => {
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

  describe('AssetFamiliesApi E2E', () => {
    it('should fetch an asset family by code', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families/model_pictures').reply(200, assetManagerMock.get);

      const result = await akeneoClient.assetManager.families.get('model_pictures');
      expect(result).toEqual(assetManagerMock.get);
    });

    it('should handle errors when fetching an asset family', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.assetManager.families.get('bad')).rejects.toThrow();
    });

    it('should fetch a paginated list of asset families', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families').query({ search_after: 'abc' }).reply(200, assetManagerMock.list);

      const result = await akeneoClient.assetManager.families.list({ search_after: 'abc' });
      expect(result).toEqual(assetManagerMock.list);
    });

    it('should handle errors when listing asset families', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families').reply(500, { message: 'API error' });

      await expect(akeneoClient.assetManager.families.list()).rejects.toThrow();
    });

    it('should update or create an asset family', async () => {
      nock(baseUrl).patch('/api/rest/v1/asset-families/model_pictures', assetManagerMock.get).reply(200);

      await expect(akeneoClient.assetManager.families.updateOrCreate(assetManagerMock.get)).resolves.toBeUndefined();
    });

    it('should handle API errors when updating or creating an asset family', async () => {
      nock(baseUrl).patch('/api/rest/v1/asset-families/bad').reply(400, { message: 'Bad request' });

      await expect(akeneoClient.assetManager.families.updateOrCreate({ code: 'bad' })).rejects.toThrow();
    });
  });

  describe('AssetAttributesApi E2E', () => {
    it('should fetch an asset attribute by code', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/asset-families/model_pictures/attributes/attr1')
        .reply(200, assetManagerMock.attribute.get);

      const result = await akeneoClient.assetManager.attributes.get('model_pictures', 'attr1');
      expect(result).toEqual(assetManagerMock.attribute.get);
    });

    it('should handle errors when fetching an asset attribute', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/asset-families/model_pictures/attributes/bad')
        .reply(404, { message: 'Not found' });

      await expect(akeneoClient.assetManager.attributes.get('model_pictures', 'bad')).rejects.toThrow();
    });

    it('should fetch a list of asset attributes', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/asset-families/model_pictures/attributes')
        .reply(200, assetManagerMock.attribute.list);

      const result = await akeneoClient.assetManager.attributes.list('model_pictures');
      expect(result).toEqual(assetManagerMock.attribute.list);
    });

    it('should handle errors when listing asset attributes', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families/model_pictures/attributes').reply(500, { message: 'API error' });

      await expect(akeneoClient.assetManager.attributes.list('model_pictures')).rejects.toThrow();
    });

    it('should update or create an asset attribute', async () => {
      nock(baseUrl)
        .patch(
          '/api/rest/v1/asset-families/model_pictures/attributes/model_is_wearing_size',
          assetManagerMock.attribute.get,
        )
        .reply(200);

      await expect(
        akeneoClient.assetManager.attributes.updateOrCreate('model_pictures', assetManagerMock.attribute.get),
      ).resolves.toBeUndefined();
    });

    it('should handle API errors when updating or creating an asset attribute', async () => {
      nock(baseUrl)
        .patch('/api/rest/v1/asset-families/model_pictures/attributes/bad')
        .reply(400, { message: 'Bad request' });
      await expect(
        akeneoClient.assetManager.attributes.updateOrCreate('model_pictures', { code: 'bad' }),
      ).rejects.toThrow();
    });

    it('should fetch an asset attribute option by code', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/asset-families/model_pictures/attributes/attr1/options/option1')
        .reply(200, assetManagerMock.attribute.option.get);

      const result = await akeneoClient.assetManager.attributes.getAttributeOption(
        'model_pictures',
        'attr1',
        'option1',
      );
      expect(result).toEqual(assetManagerMock.attribute.option.get);
    });

    it('should handle errors when fetching an asset attribute option', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/asset-families/model_pictures/attributes/attr1/options/bad')
        .reply(404, { message: 'Not found' });

      await expect(
        akeneoClient.assetManager.attributes.getAttributeOption('model_pictures', 'attr1', 'bad'),
      ).rejects.toThrow();
    });

    it('should fetch a list of asset attribute options', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/asset-families/model_pictures/attributes/attr1/options')
        .reply(200, assetManagerMock.attribute.option.list);

      const result = await akeneoClient.assetManager.attributes.listAttributeOptions('model_pictures', 'attr1');
      expect(result).toEqual(assetManagerMock.attribute.option.list);
    });
  });

  describe('AssetMediaFilesApi E2E', () => {
    it('should create an asset media file', async () => {
      nock(baseUrl).post('/api/rest/v1/asset-media-files').reply(201, {});

      const data = { code: 'file1', file: new Blob(['test']) };
      await expect(akeneoClient.assetManager.mediaFiles.create(data)).resolves.toBeUndefined();
    });

    it('should handle errors when creating an asset media file', async () => {
      nock(baseUrl).post('/api/rest/v1/asset-media-files').reply(400, { message: 'Upload failed' });

      await expect(
        akeneoClient.assetManager.mediaFiles.create({ code: 'bad', file: new Blob(['test']) }),
      ).rejects.toThrow();
    });

    it('should download an asset media file', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      nock(baseUrl).get('/api/rest/v1/asset-media-files/file1').reply(200, mockArrayBuffer);

      const result = await akeneoClient.assetManager.mediaFiles.download('file1');
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should handle errors when downloading an asset media file', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-media-files/bad').reply(404, { message: 'Download failed' });

      await expect(akeneoClient.assetManager.mediaFiles.download('bad')).rejects.toThrow();
    });
  });

  describe('AssetsApi E2E', () => {
    it('should fetch an asset by code', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families/model_pictures/assets/a1').reply(200, assetManagerMock.asset.get);

      const result = await akeneoClient.assetManager.assets.get('model_pictures', 'a1');
      expect(result).toEqual(assetManagerMock.asset.get);
    });

    it('should handle errors when fetching an asset', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families/model_pictures/assets/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.assetManager.assets.get('model_pictures', 'bad')).rejects.toThrow();
    });

    it('should fetch a paginated list of assets', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/asset-families/model_pictures/assets')
        .query({ search_after: 'abc' })
        .reply(200, assetManagerMock.asset.list);

      const result = await akeneoClient.assetManager.assets.list('model_pictures', { search_after: 'abc' });
      expect(result).toEqual(assetManagerMock.asset.list);
    });

    it('should handle errors when listing assets', async () => {
      nock(baseUrl).get('/api/rest/v1/asset-families/model_pictures/assets').reply(500, { message: 'API error' });

      await expect(akeneoClient.assetManager.assets.list('model_pictures')).rejects.toThrow();
    });

    it('should update or create an asset', async () => {
      nock(baseUrl)
        .patch('/api/rest/v1/asset-families/model_pictures/assets/a1', {
          code: 'a1',
        })
        .reply(200);

      await expect(
        akeneoClient.assetManager.assets.updateOrCreate('model_pictures', { code: 'a1' }),
      ).resolves.toBeUndefined();
    });

    it('should handle API errors when updating or creating an asset', async () => {
      nock(baseUrl)
        .patch('/api/rest/v1/asset-families/model_pictures/assets/bad')
        .reply(400, { message: 'Bad request' });

      await expect(
        akeneoClient.assetManager.assets.updateOrCreate('model_pictures', { code: 'bad' }),
      ).rejects.toThrow();
    });
  });
});
