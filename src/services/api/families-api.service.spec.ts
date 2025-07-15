import { CreateVariantFamilyRequest, FamiliesApi } from './families-api.service';
import { AkeneoApiClient } from '../';
import { Family } from '../../types';

describe('FamiliesApi', () => {
  const mockHttpClient = {
    patch: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: FamiliesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new FamiliesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const families: Partial<Family>[] = [
        { code: 'family1', labels: { en_US: 'Family 1' } },
        { code: 'family2', labels: { en_US: 'Family 2' } },
      ];

      const mockResponseData = [
        JSON.stringify({ code: 'family1', status_code: 200, attributes: ['attr1'] }),
        JSON.stringify({ code: 'family2', status_code: 201, attributes: ['attr2'] }),
      ].join('\n');

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(families);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/families',
        JSON.stringify(families[0]) + '\n' + JSON.stringify(families[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { code: 'family1', status_code: 200, attributes: ['attr1'] },
        { code: 'family2', status_code: 201, attributes: ['attr2'] },
      ]);
    });

    it('should send PATCH request with correct data and parse response with non string response', async () => {
      const families: Partial<Family>[] = [{ code: 'family1', labels: { en_US: 'Family 1' } }];

      const mockResponseData = { code: 'family1', status_code: 200, attributes: ['attr1'] };

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(families);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/families', JSON.stringify(families[0]), {
        headers: {
          'Content-Type': 'application/vnd.akeneo.collection+json',
        },
      });

      expect(result).toEqual([mockResponseData]);
    });
  });

  describe('createVariantFamily', () => {
    it('should send POST request to the correct endpoint', async () => {
      const familyCode = 'family1';
      const data: CreateVariantFamilyRequest = {
        code: 'family1',
        variant_attribute_sets: [],
      };

      mockHttpClient.post.mockResolvedValue({});

      await api.createVariantFamily(familyCode, data);

      expect(mockHttpClient.post).toHaveBeenCalledWith(`/api/rest/v1/families/${familyCode}/variants`, data);
    });
  });

  describe('listVariantFamilies', () => {
    it('should send GET request with params and return paginated response', async () => {
      const familyCode = 'family1';
      const params = { page: 2, limit: 5 };
      const mockResponse = { _embedded: { items: [] }, current_page: 2, items_count: 0, _links: {} };

      mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockResponse });

      const result = await api.listVariantFamilies(familyCode, params);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/families/family1/variants', { params });
      expect(result).toBe(mockResponse);
    });
  });

  describe('getVariantFamily', () => {
    it('should send GET request and return variant family', async () => {
      const familyCode = 'family1';
      const mockVariantFamily = { code: 'family1', variant_attribute_sets: [] };

      mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockVariantFamily });

      const result = await api.getVariantFamily(familyCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/families/family1/variants');
      expect(result).toBe(mockVariantFamily);
    });
  });

  describe('updateVariantFamily', () => {
    it('should send PATCH request to the correct endpoint', async () => {
      const familyCode = 'family1';
      const code = 'variant1';
      const data = { labels: { en_US: 'Variant 1' } };

      mockHttpClient.patch = jest.fn().mockResolvedValue({});

      await api.updateVariantFamily(familyCode, code, data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/families/family1/variants/variant1', data);
    });
  });

  describe('updateOrCreateSeveralVariantFamilies', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const familyCode = 'family1';
      const variantFamilies = [
        { code: 'variant1', labels: { en_US: 'Variant 1' } },
        { code: 'variant2', labels: { en_US: 'Variant 2' } },
      ];
      const mockResponseData = [
        JSON.stringify({ line: 1, code: 'variant1', status_code: 200, message: 'ok' }),
        JSON.stringify({ line: 2, code: 'variant2', status_code: 201, message: 'created' }),
      ].join('\n');

      mockHttpClient.patch = jest.fn().mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveralVariantFamilies(familyCode, variantFamilies);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/families/family1/variants',
        JSON.stringify(variantFamilies[0]) + '\n' + JSON.stringify(variantFamilies[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, code: 'variant1', status_code: 200, message: 'ok' },
        { line: 2, code: 'variant2', status_code: 201, message: 'created' },
      ]);
    });

    it('should send PATCH request with correct data and parse response with non string response', async () => {
      const familyCode = 'family1';
      const variantFamilies = [{ code: 'variant1', labels: { en_US: 'Variant 1' } }];
      const mockResponseData = { line: 1, code: 'variant1', status_code: 200, message: 'ok' };

      mockHttpClient.patch = jest.fn().mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveralVariantFamilies(familyCode, variantFamilies);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/families/family1/variants',
        JSON.stringify(variantFamilies[0]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([mockResponseData]);
    });
  });
});
