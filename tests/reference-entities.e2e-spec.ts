import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import referenceEntityMock from './mocks/reference-entity.mock';
import { ReferenceEntityAttributeType } from '../src/types';

describe('ReferenceEntities E2E', () => {
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

  describe('ReferenceEntitiesApi E2E', () => {
    it('should fetch a reference entity by identifier', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities/brand').reply(200, referenceEntityMock.get);

      const result = await akeneoClient.referenceEntities.get('brand');
      expect(result).toEqual(referenceEntityMock.get);
    });

    it('should handle errors when fetching a reference entity', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.referenceEntities.get('bad')).rejects.toThrow();
    });

    it('should fetch a paginated list of reference entities', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities')
        .query({ search_after: 'abc' })
        .reply(200, referenceEntityMock.list);

      const result = await akeneoClient.referenceEntities.list({ search_after: 'abc' });
      expect(result).toEqual(referenceEntityMock.list);
    });

    it('should handle errors when listing reference entities', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities').reply(500, { message: 'API error' });

      await expect(akeneoClient.referenceEntities.list()).rejects.toThrow();
    });

    it('should update or create a reference entity', async () => {
      nock(baseUrl).patch('/api/rest/v1/reference-entities/brand', referenceEntityMock.get).reply(200);

      await expect(akeneoClient.referenceEntities.updateOrCreate(referenceEntityMock.get)).resolves.toBeUndefined();
    });

    it('should handle API errors when updating or creating a reference entity', async () => {
      nock(baseUrl).patch('/api/rest/v1/reference-entities/bad').reply(400, { message: 'Bad request' });

      await expect(akeneoClient.referenceEntities.updateOrCreate({ code: 'bad', labels: {} })).rejects.toThrow();
    });
  });

  describe('ReferenceEntitiesAttributesApi E2E', () => {
    it('should fetch a reference entity attribute by code', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/attributes/color')
        .reply(200, referenceEntityMock.attribute.get);

      const result = await akeneoClient.referenceEntities.attributes.get('brand', 'color');
      expect(result).toEqual(referenceEntityMock.attribute.get);
    });

    it('should handle errors when fetching a reference entity attribute', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities/brand/attributes/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.referenceEntities.attributes.get('brand', 'bad')).rejects.toThrow();
    });

    it('should fetch a list of reference entity attributes', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/attributes')
        .reply(200, referenceEntityMock.attribute.list);

      const result = await akeneoClient.referenceEntities.attributes.list('brand');
      expect(result).toEqual(referenceEntityMock.attribute.list);
    });

    it('should handle errors when listing reference entity attributes', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities/brand/attributes').reply(500, { message: 'API error' });

      await expect(akeneoClient.referenceEntities.attributes.list('brand')).rejects.toThrow();
    });

    it('should handle API errors when updating or creating a reference entity attribute', async () => {
      nock(baseUrl)
        .patch('/api/rest/v1/reference-entities/brand/attributes/bad')
        .reply(400, { message: 'Bad request' });

      await expect(
        akeneoClient.referenceEntities.attributes.updateOrCreate('brand', {
          code: 'bad',
          type: ReferenceEntityAttributeType.TEXT,
          labels: {},
        }),
      ).rejects.toThrow();
    });

    it('should fetch a reference entity attribute option by code', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/attributes/color/options/red')
        .reply(200, referenceEntityMock.attribute.attributeOption.get);

      const result = await akeneoClient.referenceEntities.attributes.getAttributeOption('brand', 'color', 'red');
      expect(result).toEqual(referenceEntityMock.attribute.attributeOption.get);
    });

    it('should handle errors when fetching a reference entity attribute option', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/attributes/color/options/bad')
        .reply(404, { message: 'Not found' });

      await expect(
        akeneoClient.referenceEntities.attributes.getAttributeOption('brand', 'color', 'bad'),
      ).rejects.toThrow();
    });

    it('should fetch a list of reference entity attribute options', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/attributes/color/options')
        .reply(200, referenceEntityMock.attribute.attributeOption.list);

      const result = await akeneoClient.referenceEntities.attributes.listAttributeOptions('brand', 'color');
      expect(result).toEqual(referenceEntityMock.attribute.attributeOption.list);
    });

    it('should handle errors when listing reference entity attribute options', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/attributes/color/options')
        .reply(500, { message: 'API error' });

      await expect(akeneoClient.referenceEntities.attributes.listAttributeOptions('brand', 'color')).rejects.toThrow();
    });
  });

  describe('ReferenceEntitiesRecordsApi E2E', () => {
    it('should fetch a reference entity record by code', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/records/rec1')
        .reply(200, referenceEntityMock.record.get);

      const result = await akeneoClient.referenceEntities.records.get('brand', 'rec1');
      expect(result).toEqual(referenceEntityMock.record.get);
    });

    it('should handle errors when fetching a reference entity record', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities/brand/records/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.referenceEntities.records.get('brand', 'bad')).rejects.toThrow();
    });

    it('should fetch a paginated list of reference entity records', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/reference-entities/brand/records')
        .query({ search: 'foo' })
        .reply(200, referenceEntityMock.record.list);

      const result = await akeneoClient.referenceEntities.records.list('brand', { search: 'foo' });
      expect(result).toEqual(referenceEntityMock.record.list);
    });

    it('should handle errors when listing reference entity records', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities/brand/records').reply(500, { message: 'API error' });

      await expect(akeneoClient.referenceEntities.records.list('brand')).rejects.toThrow();
    });

    it('should handle API errors when updating or creating a reference entity record', async () => {
      nock(baseUrl).patch('/api/rest/v1/reference-entities/brand/records/bad').reply(400, { message: 'Bad request' });

      await expect(
        akeneoClient.referenceEntities.records.updateOrCreate('brand', {
          code: 'bad',
          values: {},
        }),
      ).rejects.toThrow();
    });
  });

  describe('ReferenceEntitiesMediaFilesApi E2E', () => {
    it('should create a media file with FormData', async () => {
      const formData = new FormData();
      formData.append('file', new Blob(['file-content']), 'file1');
      nock(baseUrl).post('/api/rest/v1/reference-entities-media-files').reply(201);

      await expect(
        akeneoClient.referenceEntities.mediaFiles.create({ code: 'file1', file: 'file-content' }),
      ).resolves.toBeUndefined();
    });

    it('should handle API errors when creating a media file', async () => {
      nock(baseUrl).post('/api/rest/v1/reference-entities-media-files').reply(400, { message: 'Bad request' });

      await expect(akeneoClient.referenceEntities.mediaFiles.create({ code: 'bad', file: 'file' })).rejects.toThrow();
    });

    it('should download a media file as ArrayBuffer', async () => {
      const mockBuffer = new ArrayBuffer(8);
      const nodeBuffer = Buffer.from(mockBuffer);

      nock(baseUrl)
        .get('/api/rest/v1/reference-entities-media-files/file1')
        .reply(200, nodeBuffer, { 'Content-Type': 'application/octet-stream' });

      const result = await akeneoClient.referenceEntities.mediaFiles.download('file1');
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should handle API errors when downloading a media file', async () => {
      nock(baseUrl).get('/api/rest/v1/reference-entities-media-files/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.referenceEntities.mediaFiles.download('bad')).rejects.toThrow();
    });
  });
});
