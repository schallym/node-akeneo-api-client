import { AttributeGroupsApi } from './attribute-groups-api.service';
import { AkeneoApiClient } from '../';
import { AttributeGroup } from '../../types';

describe('AttributeGroupsApi', () => {
  const mockHttpClient = {
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: AttributeGroupsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new AttributeGroupsApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const groups: Partial<AttributeGroup>[] = [
        { code: 'group1', sort_order: 1 },
        { code: 'group2', sort_order: 2 },
      ];

      const mockResponseData = [
        JSON.stringify({ line: 1, code: 'group1', status_code: 200, message: 'ok' }),
        JSON.stringify({ line: 2, code: 'group2', status_code: 201, message: 'created' }),
      ].join('\n');

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(groups);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/attribute-groups',
        JSON.stringify(groups[0]) + '\n' + JSON.stringify(groups[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, code: 'group1', status_code: 200, message: 'ok' },
        { line: 2, code: 'group2', status_code: 201, message: 'created' },
      ]);
    });
  });
});
