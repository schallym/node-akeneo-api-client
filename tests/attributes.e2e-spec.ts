import nock from 'nock';
import { CreateAttributeOptionRequest } from '../src/services/api';
import { Attribute, AttributeTypes } from '../src/types';
import attributeMock from './mocks/attribute.mock';
import AkeneoClient from '../src/akeneo-client';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('keneoClient.attributes E2E', () => {
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

  it('should update or create several attributes', async () => {
    const attributes: Partial<Attribute>[] = [
      { code: 'attr1', type: AttributeTypes.TEXT, group: 'group1' },
      { code: 'attr2', type: AttributeTypes.NUMBER, group: 'group2' },
    ];

    nock(baseUrl).patch('/api/rest/v1/attributes').reply(200, attributeMock.updateCreateSeveralAttributeOptions);

    const result = await akeneoClient.attributes.updateOrCreateSeveral(attributes);

    expect(result).toEqual([
      {
        line: 1,
        code: 'attributeOption1',
        status_code: 200,
        message: 'Attribute option attributeOption1 updated successfully.',
      },
      {
        line: 2,
        code: 'attributeOption2',
        status_code: 201,
        message: 'Attribute option attributeOption2 created successfully.',
      },
    ]);
  });

  it('should list attribute options', async () => {
    const attributeCode = 'attr1';

    nock(baseUrl)
      .get(`/api/rest/v1/attributes/${attributeCode}/options`)
      .query({ page: 1, limit: 10 })
      .reply(200, attributeMock.listAttributeOptions);

    const result = await akeneoClient.attributes.listAttributeOptions(attributeCode, { page: 1, limit: 10 });

    expect(result).toEqual(attributeMock.listAttributeOptions);
  });

  it('should get an attribute option', async () => {
    const attributeCode = 'attr1';
    const optionCode = 'opt1';

    nock(baseUrl)
      .get(`/api/rest/v1/attributes/${attributeCode}/options/${optionCode}`)
      .reply(200, attributeMock.getAttributeOption);

    const result = await akeneoClient.attributes.getAttributeOption(attributeCode, optionCode);

    expect(result).toEqual(attributeMock.getAttributeOption);
  });

  it('should create an attribute option', async () => {
    const attributeCode = 'attr1';
    const data: CreateAttributeOptionRequest = { code: 'opt2' };
    const mockOption = { code: 'opt2', attribute: 'attr1', sort_order: 2, labels: {} };

    nock(baseUrl)
      .post(`/api/rest/v1/attributes/${attributeCode}/options`, (body) => body.code === 'opt2')
      .reply(201, mockOption);

    const result = await akeneoClient.attributes.createAttributeOption(attributeCode, data);

    expect(result).toEqual(mockOption);
  });

  it('should update an attribute option', async () => {
    const attributeCode = 'attr1';
    const optionCode = 'opt1';
    const data = { labels: { en_US: 'Option 1' } };

    nock(baseUrl)
      .patch(
        `/api/rest/v1/attributes/${attributeCode}/options/${optionCode}`,
        (body) => body.labels.en_US === 'Option 1',
      )
      .reply(204);

    await expect(
      akeneoClient.attributes.updateAttributeOption(attributeCode, optionCode, data),
    ).resolves.toBeUndefined();
  });

  it('should update or create several attribute options', async () => {
    const attributeCode = 'attr1';
    const options = [
      { code: 'opt1', labels: { en_US: 'Option 1' } },
      { code: 'opt2', labels: { en_US: 'Option 2' } },
    ];
    const mockResponse =
      JSON.stringify({ line: 1, code: 'opt1', status_code: 200, message: 'ok' }) +
      '\n' +
      JSON.stringify({ line: 2, code: 'opt2', status_code: 201, message: 'created' });

    nock(baseUrl).patch(`/api/rest/v1/attributes/${attributeCode}/options`).reply(200, mockResponse);

    const result = await akeneoClient.attributes.updateOrCreateSeveralAttributeOptions(attributeCode, options);

    expect(result).toEqual([
      { line: 1, code: 'opt1', status_code: 200, message: 'ok' },
      { line: 2, code: 'opt2', status_code: 201, message: 'created' },
    ]);
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/attributes').reply(400, { code: 400, message: 'Bad request' });

    await expect(akeneoClient.attributes.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });
});
