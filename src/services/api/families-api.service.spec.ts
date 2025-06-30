import { CreateVariantFamilyRequest, FamiliesApi } from './families-api.service';
import { AkeneoApiClient } from '../';
import { Family } from '../../types';

describe('FamiliesApi', () => {
  const mockHttpClient = {
    patch: jest.fn(),
    post: jest.fn(),
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

      const mockResponseData = '{"code":200,"attributes":["attr1"]}\n' + '{"code":201,"attributes":["attr2"]}';

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
        { code: 200, attributes: ['attr1'] },
        { code: 201, attributes: ['attr2'] },
      ]);
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
});
