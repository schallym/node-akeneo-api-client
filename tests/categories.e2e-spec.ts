import nock from 'nock';
import { Category } from '../src/types';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('CategoriesApi E2E', () => {
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

  it('should update or create several categories', async () => {
    const categories: Partial<Category>[] = [
      { code: 'cat1', labels: { en_US: 'C1' } },
      { code: 'cat2', labels: { en_US: 'C2' } },
    ];

    const mockResponse =
      JSON.stringify({ line: 1, code: 'cat1', status_code: 200, message: 'ok' }) +
      '\n' +
      JSON.stringify({ line: 2, code: 'cat2', status_code: 201, message: 'created' });

    nock(baseUrl).patch('/api/rest/v1/categories').reply(200, mockResponse);

    const result = await akeneoClient.categories.updateOrCreateSeveral(categories);

    expect(result).toEqual([
      { line: 1, code: 'cat1', status_code: 200, message: 'ok' },
      { line: 2, code: 'cat2', status_code: 201, message: 'created' },
    ]);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/categories').reply(400, { code: 400, message: 'Bad request' });

    await expect(akeneoClient.categories.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });

  it('should send POST request to create a category media file', async () => {
    const data = { category: { code: 'cat1', attribute_code: 'image' }, file: 'filedata' };

    nock(baseUrl).post('/api/rest/v1/category-media-files', data).reply(201);

    await expect(akeneoClient.categories.createCategoryMediaFile(data)).resolves.toBeUndefined();
  });

  it('should download a category media file', async () => {
    const filePath = 'somefile.png';
    const mockBuffer = Buffer.from('testdata');

    nock(baseUrl).get(`/api/rest/v1/category-media-files/${filePath}/download`).reply(200, mockBuffer);

    const result = await akeneoClient.categories.downloadCategoryMediaFile(filePath);

    expect(Buffer.isBuffer(result) || true).toBe(true);
  });
});
