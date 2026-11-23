import nock from 'nock';
import { Channel } from '../src/types';
import { AkeneoClient } from '../src';
import { baseUrl, setupAkeneoClient, setupNock, teardownNock } from './akeneo-client-test.utils';

describe('ChannelsApi E2E', () => {
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

  it('should update or create several channels', async () => {
    const channels: Partial<Channel>[] = [
      { code: 'ecommerce', labels: { en_US: 'Ecommerce' } },
      { code: 'mobile', labels: { en_US: 'Mobile' } },
    ];

    const mockResponse =
      JSON.stringify({ line: 1, code: 'ecommerce', status_code: 200, message: 'ok' }) +
      '\n' +
      JSON.stringify({ line: 2, code: 'mobile', status_code: 201, message: 'created' });

    nock(baseUrl).patch('/api/rest/v1/channels').reply(200, mockResponse);

    const result = await akeneoClient.channels.updateOrCreateSeveral(channels);

    expect(result).toEqual([
      { line: 1, code: 'ecommerce', status_code: 200, message: 'ok' },
      { line: 2, code: 'mobile', status_code: 201, message: 'created' },
    ]);
  });

  it('should get a channel with conversion unit decimal-precision settings', async () => {
    const channel: Channel = {
      code: 'ecommerce',
      locales: ['en_US', 'fr_FR'],
      currencies: ['EUR'],
      category_tree: 'master',
      conversion_units: {
        weight: 'KILOGRAM',
        pim_config_family_rules: {
          Power: { en_US: 'KILOWATT', fr_FR: { unit: 'WATT', decimal_places_strategy: 'round', decimal_places: 2 } },
        },
        pim_config_attribute_locale_rules: { weight: { en_US: 'KILOGRAM' } },
        pim_config_attribute_default_precision: {
          weight: { decimal_places_strategy: 'round', decimal_places: 1 },
          length: { decimal_places_strategy: 'trim' },
          volume: null,
        },
      },
      labels: { en_US: 'Ecommerce' },
    };

    nock(baseUrl).get('/api/rest/v1/channels/ecommerce').reply(200, channel);

    const result = await akeneoClient.channels.get('ecommerce');

    expect(result).toEqual(channel);
  });

  it('should create a channel with conversion unit decimal-precision settings', async () => {
    const body = {
      code: 'print',
      locales: ['en_US'],
      currencies: ['USD'],
      category_tree: 'master',
      conversion_units: {
        weight: 'GRAM',
        pim_config_attribute_default_precision: { weight: { decimal_places_strategy: 'trim' as const } },
      },
    };

    nock(baseUrl).post('/api/rest/v1/channels', body).reply(201);

    await expect(akeneoClient.channels.create(body)).resolves.not.toThrow();
  });

  it('should handle API errors gracefully', async () => {
    nock(baseUrl).patch('/api/rest/v1/channels').reply(400, { code: 400, message: 'Bad request' });

    await expect(akeneoClient.channels.updateOrCreateSeveral([{ code: 'bad' }])).rejects.toThrow();
  });

  it('should throw when trying to delete a channel', async () => {
    await expect(akeneoClient.channels.delete()).rejects.toThrow(
      'Method not implemented. Deletion of channels is not supported by the API.',
    );
  });
});
