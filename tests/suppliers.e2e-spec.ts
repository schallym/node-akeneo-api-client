import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import supplierMock from './mocks/supplier.mock';

describe('SuppliersApi E2E', () => {
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

  describe('suppliers', () => {
    it('should fetch a supplier by code', async () => {
      nock(baseUrl).get('/api/rest/v1/suppliers/ERP-4471').reply(200, supplierMock.supplier.get);

      const result = await akeneoClient.suppliers.get('ERP-4471');
      expect(result).toEqual(supplierMock.supplier.get);
    });

    it('should handle errors when fetching a supplier', async () => {
      nock(baseUrl).get('/api/rest/v1/suppliers/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.suppliers.get('bad')).rejects.toThrow();
    });

    it('should fetch a paginated list of suppliers', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/suppliers')
        .query({ page: 1, limit: 10, with_count: true })
        .reply(200, supplierMock.supplier.list);

      const result = await akeneoClient.suppliers.list({ page: 1, limit: 10, with_count: true });
      expect(result).toEqual(supplierMock.supplier.list);
    });

    it('should handle errors when listing suppliers', async () => {
      nock(baseUrl).get('/api/rest/v1/suppliers').reply(500, { message: 'API error' });

      await expect(akeneoClient.suppliers.list()).rejects.toThrow();
    });

    it('should create a supplier', async () => {
      const data = {
        code: 'ERP-4471',
        name: 'Acme Corp',
        portal_uuid: '3f8a1b2c-4d5e-4f60-8a7b-9c0d1e2f3a4b',
        default_channel_code: 'ecommerce',
        default_locale_code: 'en_US',
      };
      nock(baseUrl).post('/api/rest/v1/suppliers', data).reply(201, { code: 'ERP-4471' });

      const result = await akeneoClient.suppliers.create(data);
      expect(result).toEqual({ code: 'ERP-4471' });
    });

    it('should handle errors when creating a supplier', async () => {
      nock(baseUrl).post('/api/rest/v1/suppliers').reply(422, { message: 'Validation failed.' });

      await expect(
        akeneoClient.suppliers.create({
          code: 'ERP-4471',
          name: 'Acme Corp',
          portal_uuid: '3f8a1b2c-4d5e-4f60-8a7b-9c0d1e2f3a4b',
          default_channel_code: 'ecommerce',
          default_locale_code: 'fr_FR',
        }),
      ).rejects.toThrow();
    });
  });

  describe('supplier users', () => {
    const userUuid = supplierMock.user.get.uuid;

    it('should fetch a supplier user by uuid', async () => {
      nock(baseUrl).get(`/api/rest/v1/suppliers/ERP-4471/users/${userUuid}`).reply(200, supplierMock.user.get);

      const result = await akeneoClient.suppliers.users.get('ERP-4471', userUuid);
      expect(result).toEqual(supplierMock.user.get);
    });

    it('should handle errors when fetching a supplier user', async () => {
      nock(baseUrl).get('/api/rest/v1/suppliers/ERP-4471/users/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.suppliers.users.get('ERP-4471', 'bad')).rejects.toThrow();
    });

    it('should fetch a paginated list of supplier users', async () => {
      nock(baseUrl)
        .get('/api/rest/v1/suppliers/ERP-4471/users')
        .query({ page: 1, limit: 10 })
        .reply(200, supplierMock.user.list);

      const result = await akeneoClient.suppliers.users.list('ERP-4471', { page: 1, limit: 10 });
      expect(result).toEqual(supplierMock.user.list);
    });

    it('should invite or update several supplier users', async () => {
      const data = [
        { email: 'jane@acme.test', first_name: 'Jane', last_name: 'Doe' },
        { email: 'invalid', first_name: 'John', last_name: 'Doe' },
      ];
      nock(baseUrl)
        .patch('/api/rest/v1/suppliers/ERP-4471/users', data)
        .reply(200, supplierMock.user.updateOrCreateSeveral);

      const result = await akeneoClient.suppliers.users.updateOrCreateSeveral('ERP-4471', data);
      expect(result).toEqual(supplierMock.user.updateOrCreateSeveral);
    });

    it('should revoke a supplier user', async () => {
      const scope = nock(baseUrl).delete(`/api/rest/v1/suppliers/ERP-4471/users/${userUuid}`).reply(204);

      await akeneoClient.suppliers.users.delete('ERP-4471', userUuid);
      expect(scope.isDone()).toBe(true);
    });

    it('should handle errors when revoking a supplier user', async () => {
      nock(baseUrl).delete('/api/rest/v1/suppliers/ERP-4471/users/bad').reply(404, { message: 'Not found' });

      await expect(akeneoClient.suppliers.users.delete('ERP-4471', 'bad')).rejects.toThrow();
    });
  });
});
