import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import catalogForAppsMock from './mocks/catalog-for-apps.mock';

describe('CatalogForAppsApi E2E', () => {
  let akeneoClient: AkeneoClient;

  beforeAll(() => {
    akeneoClient = setupAkeneoClient();
  });

  beforeEach(() => {
    setupNock();
  });

  afterAll(() => {
    teardownNock();
  });

  describe('Catalogs', () => {
    it('should get a catalog by id', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/catalogs/12351d98-200e-4bbc-aa19-7fdda1bd14f2')
        .reply(200, catalogForAppsMock.get);

      const result = await akeneoClient.catalogForApps.catalogs.get('12351d98-200e-4bbc-aa19-7fdda1bd14f2');
      expect(result).toEqual(catalogForAppsMock.get);
    });

    it('should list catalogs', async () => {
      nock(baseUrl).get('/api/rest/v1/catalogs').query(true).reply(200, catalogForAppsMock.list);

      const result = await akeneoClient.catalogForApps.catalogs.list();
      expect(result).toEqual(catalogForAppsMock.list);
    });

    it('should update a catalog', async () => {
      const updateData = { name: 'Updated Catalog' };
      const updatedCatalog = { ...catalogForAppsMock.get, ...updateData };
      nock(baseUrl)
        .patch('/api/rest/v1/catalogs/12351d98-200e-4bbc-aa19-7fdda1bd14f2', updateData)
        .reply(200, updatedCatalog);

      const result = await akeneoClient.catalogForApps.catalogs.update(
        '12351d98-200e-4bbc-aa19-7fdda1bd14f2',
        updateData,
      );
      expect(result).toBeUndefined();
    });

    it('should remove a catalog', async () => {
      nock(baseUrl).delete('/api/rest/v1/catalogs/12351d98-200e-4bbc-aa19-7fdda1bd14f2').reply(204);

      await expect(
        akeneoClient.catalogForApps.catalogs.delete('12351d98-200e-4bbc-aa19-7fdda1bd14f2'),
      ).resolves.toBeUndefined();
    });

    it('should duplicate a catalog', async () => {
      nock(baseUrl)
        .post('/api/rest/v1/catalogs/12351d98-200e-4bbc-aa19-7fdda1bd14f2/duplicate')
        .reply(200, catalogForAppsMock.duplicate);

      const result = await akeneoClient.catalogForApps.catalogs.duplicate('12351d98-200e-4bbc-aa19-7fdda1bd14f2');
      expect(result).toEqual(catalogForAppsMock.duplicate);
    });

    it('should handle errors for get', async () => {
      nock(baseUrl).get('/api/rest/v1/catalogs/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.catalogForApps.catalogs.get('bad')).rejects.toThrow();
    });

    it('should handle errors for list', async () => {
      nock(baseUrl).get('/api/rest/v1/catalogs').reply(500, { message: 'API error' });

      await expect(akeneoClient.catalogForApps.catalogs.list()).rejects.toThrow();
    });

    it('should handle errors for update', async () => {
      nock(baseUrl).patch('/api/rest/v1/catalogs/bad').reply(400, { message: 'Bad request' });

      await expect(akeneoClient.catalogForApps.catalogs.update('bad', { name: 'bad' })).rejects.toThrow();
    });

    it('should handle errors for remove', async () => {
      nock(baseUrl).delete('/api/rest/v1/catalogs/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.catalogForApps.catalogs.delete('bad')).rejects.toThrow();
    });

    it('should handle errors for duplicate', async () => {
      nock(baseUrl).post('/api/rest/v1/catalogs/bad/duplicate').reply(400, { message: 'Duplicate failed' });

      await expect(akeneoClient.catalogForApps.catalogs.duplicate('bad')).rejects.toThrow();
    });
  });

  describe('CatalogProducts', () => {
    const catalogId = 'catalog-123';
    const productUuid = 'uuid-456';
    const modelCode = 'model-789';

    it('should list product uuids', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/products/uuids`)
        .query({ limit: 10 })
        .reply(200, catalogForAppsMock.catalogProducts.uuids);

      const result = await akeneoClient.catalogForApps.catalogProducts.listProductUuids(catalogId, { limit: 10 });
      expect(result).toEqual(catalogForAppsMock.catalogProducts.uuids);
    });

    it('should list products', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/products`)
        .query({ limit: 5 })
        .reply(200, catalogForAppsMock.catalogProducts.products);

      const result = await akeneoClient.catalogForApps.catalogProducts.listProducts(catalogId, { limit: 5 });
      expect(result).toEqual(catalogForAppsMock.catalogProducts.products);
    });

    it('should get a product by uuid', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/products/${productUuid}`)
        .reply(200, catalogForAppsMock.catalogProducts.product);

      const result = await akeneoClient.catalogForApps.catalogProducts.getProduct(catalogId, productUuid);
      expect(result).toEqual(catalogForAppsMock.catalogProducts.product);
    });

    it('should list mapped products', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/mapped-products`)
        .query({ limit: 2 })
        .reply(200, catalogForAppsMock.catalogProducts.mappedProducts);

      const result = await akeneoClient.catalogForApps.catalogProducts.listMappedProducts(catalogId, { limit: 2 });
      expect(result).toEqual(catalogForAppsMock.catalogProducts.mappedProducts);
    });

    it('should list mapped models', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/mapped-models`)
        .query({ limit: 3 })
        .reply(200, catalogForAppsMock.catalogProducts.mappedModels);

      const result = await akeneoClient.catalogForApps.catalogProducts.listMappedModels(catalogId, { limit: 3 });
      expect(result).toEqual(catalogForAppsMock.catalogProducts.mappedModels);
    });

    it('should list mapped model variants', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/mapped-models/${modelCode}/variants`)
        .query({ limit: 4 })
        .reply(200, catalogForAppsMock.catalogProducts.mappedModel.variants);

      const result = await akeneoClient.catalogForApps.catalogProducts.listMappedModelVariants(catalogId, modelCode, {
        limit: 4,
      });
      expect(result).toEqual(catalogForAppsMock.catalogProducts.mappedModel.variants);
    });

    it('should handle errors for listProductUuids', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/products/uuids`)
        .query(true)
        .reply(500, { message: 'Error' });

      await expect(
        akeneoClient.catalogForApps.catalogProducts.listProductUuids(catalogId, { limit: 10 }),
      ).rejects.toThrow();
    });

    it('should handle errors for listProducts', async () => {
      nock(baseUrl).get(`/api/rest/v1/catalogs/${catalogId}/products`).query(true).reply(500, { message: 'Error' });

      await expect(akeneoClient.catalogForApps.catalogProducts.listProducts(catalogId, { limit: 5 })).rejects.toThrow();
    });
  });

  describe('MappingSchemas', () => {
    const catalogId = 'catalog-123';

    it('should get mapping schema for products', async () => {
      nock(baseUrl)
        .get(`/api/rest/v1/catalogs/${catalogId}/mapping-schemas/product`)
        .reply(200, catalogForAppsMock.mappingSchemas.product.get);

      const result = await akeneoClient.catalogForApps.mappingSchemas.getForProducts(catalogId);
      expect(result).toEqual(catalogForAppsMock.mappingSchemas.product.get);
    });

    it('should update or create mapping schema for products', async () => {
      nock(baseUrl)
        .put(
          `/api/rest/v1/catalogs/${catalogId}/mapping-schemas/product`,
          catalogForAppsMock.mappingSchemas.product.get,
        )
        .reply(204);

      await expect(
        akeneoClient.catalogForApps.mappingSchemas.updateOrCreateForProducts(
          catalogId,
          catalogForAppsMock.mappingSchemas.product.get,
        ),
      ).resolves.toBeUndefined();
    });

    it('should delete mapping schema for products', async () => {
      nock(baseUrl).delete(`/api/rest/v1/catalogs/${catalogId}/mapping-schemas/product`).reply(204);

      await expect(akeneoClient.catalogForApps.mappingSchemas.deleteForProducts(catalogId)).resolves.toBeUndefined();
    });
  });
});
