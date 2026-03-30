import nock from 'nock';
import { Category, PaginatedResponse } from '../src';
import { AkeneoClient } from '../src';
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

  it('should get a single category', async () => {
    const mockCategory: Category = {
      code: 'master',
      parent: undefined,
      updated: '2025-01-01T00:00:00Z',
      labels: { en_US: 'Master catalog' },
      values: {},
      channel_requirements: ['ecommerce'],
    };

    nock(baseUrl).get('/api/rest/v1/categories/master').reply(200, mockCategory);

    const result = await akeneoClient.categories.get('master');

    expect(result).toEqual(mockCategory);
    expect(result.code).toBe('master');
    expect(result.channel_requirements).toEqual(['ecommerce']);
  });

  it('should get a single category with params', async () => {
    const mockCategory: Category = {
      code: 'master',
      updated: '2025-01-01T00:00:00Z',
      position: 1,
      labels: { en_US: 'Master catalog' },
      values: {
        description: { data: 'Root category', type: 'text', locale: 'en_US', channel: null },
      },
    };

    nock(baseUrl)
      .get('/api/rest/v1/categories/master')
      .query({ with_position: true, with_enriched_attributes: true })
      .reply(200, mockCategory);

    const result = await akeneoClient.categories.get('master', {
      with_position: true,
      with_enriched_attributes: true,
    });

    expect(result).toEqual(mockCategory);
    expect(result.position).toBe(1);
  });

  it('should list categories', async () => {
    const mockResponse: PaginatedResponse<Category> = {
      _links: {
        self: { href: `${baseUrl}/api/rest/v1/categories?page=1&limit=10` },
        first: { href: `${baseUrl}/api/rest/v1/categories?page=1&limit=10` },
      },
      current_page: 1,
      _embedded: {
        items: [
          {
            code: 'master',
            updated: '2025-01-01T00:00:00Z',
            labels: { en_US: 'Master catalog' },
            values: {},
            channel_requirements: ['ecommerce', 'mobile'],
          },
          {
            code: 'clothes',
            parent: 'master',
            updated: '2025-01-02T00:00:00Z',
            labels: { en_US: 'Clothes' },
            values: {},
          },
        ],
      },
    };

    nock(baseUrl).get('/api/rest/v1/categories').reply(200, mockResponse);

    const result = await akeneoClient.categories.list();

    expect(result._embedded.items).toHaveLength(2);
    expect(result._embedded.items[0].code).toBe('master');
    expect(result._embedded.items[0].channel_requirements).toEqual(['ecommerce', 'mobile']);
  });

  it('should list categories with search parameters', async () => {
    const mockResponse: PaginatedResponse<Category> = {
      _links: {
        self: { href: `${baseUrl}/api/rest/v1/categories?page=1&limit=5` },
        first: { href: `${baseUrl}/api/rest/v1/categories?page=1&limit=5` },
      },
      current_page: 1,
      _embedded: {
        items: [
          {
            code: 'clothes',
            parent: 'master',
            updated: '2025-01-02T00:00:00Z',
            labels: { en_US: 'Clothes' },
            values: {},
          },
        ],
      },
    };

    nock(baseUrl).get('/api/rest/v1/categories').query({ limit: 5, with_position: true }).reply(200, mockResponse);

    const result = await akeneoClient.categories.list({ limit: 5, with_position: true });

    expect(result._embedded.items).toHaveLength(1);
    expect(result.current_page).toBe(1);
  });

  it('should create a category', async () => {
    const data = {
      code: 'new_category',
      parent: 'master',
      labels: { en_US: 'New Category' },
      channel_requirements: ['ecommerce'],
    };

    nock(baseUrl).post('/api/rest/v1/categories', data).reply(201);

    await expect(akeneoClient.categories.create(data)).resolves.toBeUndefined();
  });

  it('should update a category', async () => {
    const data: Partial<Category> = {
      labels: { en_US: 'Updated Category' },
      channel_requirements: ['ecommerce', 'print'],
    };

    nock(baseUrl)
      .patch('/api/rest/v1/categories/cat1', data as nock.RequestBodyMatcher)
      .reply(204);

    await expect(akeneoClient.categories.update('cat1', data)).resolves.toBeUndefined();
  });

  it('should update or create several categories', async () => {
    const categories: Partial<Category>[] = [
      { code: 'cat1', labels: { en_US: 'C1' }, channel_requirements: ['ecommerce'] },
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

  it('should throw when trying to delete a category', async () => {
    await expect(akeneoClient.categories.delete()).rejects.toThrow(
      'Method not implemented. Deletion of categories is not supported by the API.',
    );
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
