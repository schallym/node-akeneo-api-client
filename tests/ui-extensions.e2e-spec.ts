import nock from 'nock';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';
import uiExtensionsMock from './mocks/ui-extensions.mock';
import { UIExtensionPosition, UIExtensionType } from '../src/types';

describe('UIExtensionsApi E2E', () => {
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

  it('should list UI extensions', async () => {
    nock(baseUrl).get('/api/rest/v1/ui-extensions').reply(200, uiExtensionsMock.list);

    const result = await akeneoClient.uiExtensions.list();
    expect(result).toEqual(uiExtensionsMock.list);
  });

  it('should create a UI extension', async () => {
    nock(baseUrl)
      .post('/api/rest/v1/ui-extensions', (body) => !!body)
      .reply(201, uiExtensionsMock.create);

    const result = await akeneoClient.uiExtensions.create({
      name: uiExtensionsMock.create.name,
      type: uiExtensionsMock.create.type,
      position: uiExtensionsMock.create.position,
      configuration: uiExtensionsMock.create.configuration,
    });
    expect(result).toEqual(uiExtensionsMock.create);
  });

  it('should update a UI extension', async () => {
    nock(baseUrl)
      .patch(`/api/rest/v1/ui-extensions/${uiExtensionsMock.update.uuid}`, (body) => !!body)
      .reply(200, uiExtensionsMock.update);

    const updateData = {
      uuid: uiExtensionsMock.update.uuid,
      type: 'link' as UIExtensionType,
      position: 'pim.product.header' as UIExtensionPosition,
      version: 'V1.02.4',
    };

    const result = await akeneoClient.uiExtensions.update(updateData);
    expect(result).toEqual(uiExtensionsMock.update);
  });

  it('should delete a UI extension', async () => {
    nock(baseUrl).delete(`/api/rest/v1/ui-extensions/${uiExtensionsMock.create.uuid}`).reply(204);

    await expect(akeneoClient.uiExtensions.delete(uiExtensionsMock.create.uuid)).resolves.toBeUndefined();
  });

  it('should handle errors when listing UI extensions', async () => {
    nock(baseUrl).get('/api/rest/v1/ui-extensions').reply(500, { message: 'API error' });

    await expect(akeneoClient.uiExtensions.list()).rejects.toThrow();
  });

  it('should handle errors when creating a UI extension', async () => {
    nock(baseUrl).post('/api/rest/v1/ui-extensions').reply(400, { message: 'Bad request' });

    await expect(
      akeneoClient.uiExtensions.create({
        name: 'bad',
        type: 'iframe' as UIExtensionType,
        position: 'pim.product.tab' as UIExtensionPosition,
        configuration: { url: '', labels: {}, default_label: '' },
      }),
    ).rejects.toThrow();
  });

  it('should handle errors when updating a UI extension', async () => {
    nock(baseUrl).patch(`/api/rest/v1/ui-extensions/bad`).reply(404, { message: 'Not found' });

    await expect(akeneoClient.uiExtensions.update({ uuid: 'bad' })).rejects.toThrow();
  });

  it('should handle errors when deleting a UI extension', async () => {
    nock(baseUrl).delete(`/api/rest/v1/ui-extensions/bad`).reply(404, { message: 'Not found' });

    await expect(akeneoClient.uiExtensions.delete('bad')).rejects.toThrow();
  });
});
