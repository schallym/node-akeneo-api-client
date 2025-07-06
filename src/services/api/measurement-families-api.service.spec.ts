import { MeasurementFamiliesApi } from './measurement-families-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { MeasurementFamily } from '../../types';

describe('MeasurementFamiliesApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: MeasurementFamiliesApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new MeasurementFamiliesApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('list', () => {
    it('should fetch a list of measurement families', async () => {
      const mockFamilies: MeasurementFamily[] = [
        {
          code: 'weight',
          labels: { en_US: 'Weight' },
          standard_unit_code: 'KILOGRAM',
          units: {
            KILOGRAM: {
              code: 'KILOGRAM',
              labels: { en_US: 'Kilogram' },
              symbol: 'kg',
              convert_from_standard: [
                {
                  operator: 'mul',
                  value: '1',
                },
              ],
            },
          },
        },
      ];
      mockHttpClient.get.mockResolvedValue({ data: mockFamilies });

      const result = await api.list();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/measurement-families');
      expect(result).toEqual(mockFamilies);
    });

    it('should handle errors when fetching measurement families', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.list()).rejects.toThrow('API error');
    });
  });

  describe('updateOrCreateSeveral', () => {
    it('should send PATCH request with correct data and parse response', async () => {
      const data: Partial<MeasurementFamily>[] = [
        { code: 'weight', labels: { en_US: 'Weight' } },
        { code: 'length', labels: { en_US: 'Length' } },
      ];
      const mockResponseData = [
        { code: 'weight', status_code: 201 },
        { code: 'length', status_code: 204 },
      ];

      mockHttpClient.patch.mockResolvedValue({ data: mockResponseData });

      const result = await api.updateOrCreateSeveral(data);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/measurement-families', data);
      expect(result).toEqual([
        { code: 'weight', status_code: 201 },
        { code: 'length', status_code: 204 },
      ]);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.patch.mockRejectedValue(new Error('Bad request'));

      await expect(api.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow('Bad request');
    });
  });
});
