import { AttributesApi, CreateAttributeOptionRequest } from './attributes-api.service';
import { AkeneoApiClient } from '../';
import { Attribute, AttributeTypes } from '../../types';

describe('AttributesApi', () => {
  const mockHttpClient = {
    patch: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: AttributesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new AttributesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const attributes: Partial<Attribute>[] = [
        { code: 'attr1', type: AttributeTypes.TEXT, group: 'group1' },
        { code: 'attr2', type: AttributeTypes.NUMBER, group: 'group2' },
      ];

      const mockResponseData = [
        JSON.stringify({ line: 1, code: 'attr1', status_code: 200, message: 'ok' }),
        JSON.stringify({ line: 2, code: 'attr2', status_code: 201, message: 'created' }),
      ].join('\n');

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(attributes);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/attributes',
        JSON.stringify(attributes[0]) + '\n' + JSON.stringify(attributes[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, code: 'attr1', status_code: 200, message: 'ok' },
        { line: 2, code: 'attr2', status_code: 201, message: 'created' },
      ]);
    });

    it('should send PATCH request with correct data and parse response with non string response', async () => {
      const attributes: Partial<Attribute>[] = [{ code: 'attr1', type: AttributeTypes.TEXT, group: 'group1' }];

      const mockResponseData = { line: 1, code: 'attr1', status_code: 200, message: 'ok' };

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(attributes);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/attributes', JSON.stringify(attributes[0]), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      });

      expect(result).toEqual([{ line: 1, code: 'attr1', status_code: 200, message: 'ok' }]);
    });
  });

  describe('listAttributeOptions', () => {
    it('should send GET request with params and return paginated response', async () => {
      const attributeCode = 'attr1';
      const params = { page: 1, limit: 10 };
      const mockResponse = { _embedded: { items: [] }, current_page: 1, items_count: 0, _links: {} };

      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.listAttributeOptions(attributeCode, params);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/attributes/attr1/options', { params });
      expect(result).toBe(mockResponse);
    });
  });

  describe('getAttributeOption', () => {
    it('should send GET request and return attribute option', async () => {
      const attributeCode = 'attr1';
      const optionCode = 'opt1';
      const mockOption = { code: 'opt1', attribute: 'attr1', sort_order: 1, labels: {} };

      mockHttpClient.get.mockResolvedValue({ data: mockOption });

      const result = await api.getAttributeOption(attributeCode, optionCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/attributes/attr1/options/opt1');
      expect(result).toBe(mockOption);
    });
  });

  describe('createAttributeOption', () => {
    it('should send POST request and return created option', async () => {
      const attributeCode = 'attr1';
      const data: CreateAttributeOptionRequest = { code: 'opt2' };
      const mockOption = { code: 'opt2', attribute: 'attr1', sort_order: 2, labels: {} };

      mockHttpClient.post.mockResolvedValue({ data: mockOption });

      const result = await api.createAttributeOption(attributeCode, data);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/attributes/attr1/options', data);
      expect(result).toBe(mockOption);
    });
  });

  describe('updateAttributeOption', () => {
    it('should send PATCH request to the correct endpoint', async () => {
      const attributeCode = 'attr1';
      const optionCode = 'opt1';
      const data = { labels: { en_US: 'Option 1' } };

      mockHttpClient.patch.mockResolvedValue({});

      await api.updateAttributeOption(attributeCode, optionCode, data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/attributes/attr1/options/opt1', data);
    });
  });

  describe('updateOrCreateSeveralAttributeOptions', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const attributeCode = 'attr1';
      const options = [
        { code: 'opt1', labels: { en_US: 'Option 1' } },
        { code: 'opt2', labels: { en_US: 'Option 2' } },
      ];
      const mockResponseData = [
        JSON.stringify({ line: 1, code: 'opt1', status_code: 200, message: 'ok' }),
        JSON.stringify({ line: 2, code: 'opt2', status_code: 201, message: 'created' }),
      ].join('\n');

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveralAttributeOptions(attributeCode, options);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/attributes/attr1/options',
        JSON.stringify(options[0]) + '\n' + JSON.stringify(options[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, code: 'opt1', status_code: 200, message: 'ok' },
        { line: 2, code: 'opt2', status_code: 201, message: 'created' },
      ]);
    });

    it('should send PATCH request with correct data and parse response with non string response', async () => {
      const attributeCode = 'attr1';
      const options = [{ code: 'opt1', labels: { en_US: 'Option 1' } }];
      const mockResponseData = { line: 1, code: 'opt1', status_code: 200, message: 'ok' };

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveralAttributeOptions(attributeCode, options);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/attributes/attr1/options',
        JSON.stringify(options[0]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([{ line: 1, code: 'opt1', status_code: 200, message: 'ok' }]);
    });
  });

  describe('delete', () => {
    it('should throw an error when trying to delete an attribute', async () => {
      await expect(api.delete()).rejects.toThrow(
        'Method not implemented. Deletion of attributes is not supported by the API.',
      );
    });
  });
});
