import { ReferenceEntitiesAttributesApi } from './reference-entities-attribute-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { ReferenceEntityAttribute, ReferenceEntityAttributeType } from '../../../types';

describe('ReferenceEntitiesAttributesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: ReferenceEntitiesAttributesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new ReferenceEntitiesAttributesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('getReferenceEntityAttribute', () => {
    it('should fetch a reference entity attribute by code', async () => {
      const mockAttribute: ReferenceEntityAttribute = {
        code: 'color',
        type: ReferenceEntityAttributeType.TEXT,
        labels: { en_US: 'Color' },
        value_per_channel: false,
        value_per_locale: true,
        is_required_for_completeness: true,
      };
      mockHttpClient.get.mockResolvedValue({ data: mockAttribute });
      const result = await api.get('brand', 'color');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/attributes/color');
      expect(result).toEqual(mockAttribute);
    });
  });

  describe('listReferenceEntityAttributes', () => {
    it('should fetch a list of reference entity attributes', async () => {
      const mockAttributes: ReferenceEntityAttribute[] = [
        { code: 'color', type: 'text', labels: { en_US: 'Color' } } as any,
      ];
      mockHttpClient.get.mockResolvedValue({ data: mockAttributes });
      const result = await api.list('brand');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/attributes');
      expect(result).toEqual(mockAttributes);
    });

    it('should handle errors when listing reference entity attributes', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list('brand')).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreate', () => {
    it('should send PATCH request with correct data', async () => {
      const data = { code: 'color', type: ReferenceEntityAttributeType.TEXT, labels: { en_US: 'Color' } };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreate('brand', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/attributes/color', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(
        api.updateOrCreate('brand', { code: 'bad', type: ReferenceEntityAttributeType.TEXT }),
      ).rejects.toThrow('Bad request');
    });
  });

  describe('getReferenceEntityAttributeOption', () => {
    it('should fetch a reference entity attribute option by code', async () => {
      const mockOption = { code: 'red', labels: { en_US: 'Red' } };
      mockHttpClient.get.mockResolvedValue({ data: mockOption });
      const result = await api.getAttributeOption('brand', 'color', 'red');

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/api/rest/v1/reference-entities/brand/attributes/color/options/red',
      );
      expect(result).toEqual(mockOption);
    });

    it('should handle errors when fetching a reference entity attribute option', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.getAttributeOption('brand', 'color', 'bad')).rejects.toThrow('Not found');
    });
  });

  describe('listReferenceEntityAttributeOptions', () => {
    it('should fetch a list of reference entity attribute options', async () => {
      const mockOptions = [{ code: 'red', labels: { en_US: 'Red' } }];
      mockHttpClient.get.mockResolvedValue({ data: mockOptions });
      const result = await api.listAttributeOptions('brand', 'color');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/reference-entities/brand/attributes/color/options');
      expect(result).toEqual(mockOptions);
    });

    it('should handle errors when listing reference entity attribute options', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.listAttributeOptions('brand', 'color')).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreateReferenceEntityAttributeOption', () => {
    it('should send PATCH request with correct data', async () => {
      const data = { code: 'red', labels: { en_US: 'Red' } };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreateAttributeOption('brand', 'color', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/reference-entities/brand/attributes/color/options/red',
        data,
      );
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateAttributeOption('brand', 'color', { code: 'bad', labels: {} })).rejects.toThrow(
        'Bad request',
      );
    });
  });
});
