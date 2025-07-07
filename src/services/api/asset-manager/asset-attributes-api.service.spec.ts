import {
  AssetAttributesApi,
  UpdateOrCreateAssetAttributeOptionRequest,
  UpdateOrCreateAssetAttributeRequest,
} from './asset-attributes-api.service';
import { AkeneoApiClient } from '../../akeneo-api-client';
import { AssetAttribute, AssetAttributeOption, AssetAttributeType } from '../../../types';

describe('AssetAttributesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: AssetAttributesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new AssetAttributesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('get', () => {
    it('should fetch an asset attribute by code', async () => {
      const mockAttribute: AssetAttribute = { code: 'attr1', type: 'text', labels: {} } as any;
      mockHttpClient.get.mockResolvedValue({ data: mockAttribute });

      const result = await api.get('family1', 'attr1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/attributes/attr1');
      expect(result).toEqual(mockAttribute);
    });

    it('should handle errors when fetching an asset attribute', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.get('family1', 'bad')).rejects.toThrow('Not found');
    });
  });

  describe('list', () => {
    it('should fetch a list of asset attributes', async () => {
      const mockList: AssetAttribute[] = [{ code: 'attr1', type: 'text', labels: {} } as any];
      mockHttpClient.get.mockResolvedValue({ data: mockList });

      const result = await api.list('family1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/attributes');
      expect(result).toEqual(mockList);
    });

    it('should handle errors when listing asset attributes', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list('family1')).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreate', () => {
    it('should send PATCH request with correct data', async () => {
      const data: UpdateOrCreateAssetAttributeRequest = {
        code: 'attr1',
        type: AssetAttributeType.TEXT,
        labels: { en_US: 'Attr1' },
      };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreate('family1', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/attributes/attr1', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreate('family1', { code: 'bad', type: AssetAttributeType.TEXT })).rejects.toThrow(
        'Bad request',
      );
    });
  });

  describe('getAttributeOption', () => {
    it('should fetch an attribute option by code', async () => {
      const mockOption: AssetAttributeOption = { code: 'opt1', labels: {} } as any;
      mockHttpClient.get.mockResolvedValue({ data: mockOption });

      const result = await api.getAttributeOption('family1', 'attr1', 'opt1');

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/api/rest/v1/asset-families/family1/attributes/attr1/options/opt1',
      );
      expect(result).toEqual(mockOption);
    });

    it('should handle errors when fetching an attribute option', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(api.getAttributeOption('family1', 'attr1', 'bad')).rejects.toThrow('Not found');
    });
  });

  describe('listAttributeOptions', () => {
    it('should fetch a list of attribute options', async () => {
      const mockOptions: AssetAttributeOption[] = [{ code: 'opt1', labels: {} } as any];
      mockHttpClient.get.mockResolvedValue({ data: mockOptions });

      const result = await api.listAttributeOptions('family1', 'attr1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/asset-families/family1/attributes/attr1/options');
      expect(result).toEqual(mockOptions);
    });

    it('should handle errors when listing attribute options', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.listAttributeOptions('family1', 'attr1')).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreateAttributeOption', () => {
    it('should send PATCH request with correct data', async () => {
      const data: UpdateOrCreateAssetAttributeOptionRequest = { code: 'opt1', labels: { en_US: 'Opt1' } };
      mockHttpClient.patch.mockResolvedValue({});

      await api.updateOrCreateAttributeOption('family1', 'attr1', data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/asset-families/family1/attributes/attr1/options/opt1',
        data,
      );
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateAttributeOption('family1', 'attr1', { code: 'bad' })).rejects.toThrow(
        'Bad request',
      );
    });
  });
});
