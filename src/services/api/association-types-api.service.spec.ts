import { AssociationTypesApi } from './association-types-api.service';
import { AkeneoApiClient } from '../';
import { AssociationType } from '../../types';

describe('AssociationTypesApi', () => {
  const mockHttpClient = {
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: AssociationTypesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new AssociationTypesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const types: Partial<AssociationType>[] = [
        { code: 'assoc1', labels: { en_US: 'A1' } },
        { code: 'assoc2', labels: { en_US: 'A2' } },
      ];

      const mockResponseData = [
        JSON.stringify({ line: 1, code: 'assoc1', status_code: 200, message: 'ok' }),
        JSON.stringify({ line: 2, code: 'assoc2', status_code: 201, message: 'created' }),
      ].join('\n');

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(types);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/rest/v1/association-types',
        JSON.stringify(types[0]) + '\n' + JSON.stringify(types[1]),
        {
          headers: {
            'Content-Type': 'application/vnd.akeneo.collection+json',
          },
        },
      );

      expect(result).toEqual([
        { line: 1, code: 'assoc1', status_code: 200, message: 'ok' },
        { line: 2, code: 'assoc2', status_code: 201, message: 'created' },
      ]);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow('Bad request');
    });
  });

  describe('delete', () => {
    it('should throw an error when trying to delete an association type', async () => {
      await expect(api.delete()).rejects.toThrow(
        'Method not implemented. Deletion of association types is not supported by the API.',
      );
    });
  });
});
