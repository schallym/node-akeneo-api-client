import { CreateOrUpdateRuleDefinitionRequest, RuleDefinitionsApi } from './rule-definitions-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { RuleDefinition } from '../../types';

describe('RuleDefinitionsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    put: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: RuleDefinitionsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new RuleDefinitionsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('list', () => {
    it('should send GET request with params and return paginated rule definitions', async () => {
      const mockResponse = { _embedded: { items: [{ code: 'r1' }] }, current_page: 1, _links: {} };
      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const result = await api.list({ type: 'product', enabled: true });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/rule-definitions', {
        params: { type: 'product', enabled: true },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });

  describe('get', () => {
    it('should send GET request to fetch a rule definition by code', async () => {
      const mockRule: RuleDefinition = { code: 'r1', type: 'product' };
      mockHttpClient.get.mockResolvedValue({ data: mockRule });

      const result = await api.get('r1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/rule-definitions/r1');
      expect(result).toEqual(mockRule);
    });
  });

  describe('createOrUpdate', () => {
    it('should send PUT request with the rule definition body', async () => {
      const data: CreateOrUpdateRuleDefinitionRequest = {
        type: 'product',
        actions: [{ type: 'set', field: 'brand', value: 'Akeneo' }],
        labels: { en_US: 'Set brand' },
      };
      mockHttpClient.put.mockResolvedValue({});

      await api.createOrUpdate('set_brand', data);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/rest/v1/rule-definitions/set_brand', data);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.put.mockRejectedValue(new Error('Bad request'));

      await expect(api.createOrUpdate('bad', { type: 'product', actions: [] })).rejects.toThrow('Bad request');
    });
  });
});
