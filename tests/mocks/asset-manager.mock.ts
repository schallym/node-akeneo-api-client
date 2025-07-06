import { AssetFamily } from '../../src/types';

const assetFamilyMock: AssetFamily = {
  code: 'model_pictures',
  labels: {
    en_US: 'Model pictures',
    fr_FR: 'Photographies en pied',
  },
  attribute_as_main_media: 'main_image',
  naming_convention: {
    source: {
      property: 'code',
      channel: null,
      locale: null,
    },
    pattern: '/(?P<product_ref>.*)-.*/',
    abort_asset_creation_on_error: true,
  },
  product_link_rules: [
    {
      product_selections: [
        {
          field: 'sku',
          operator: 'EQUALS',
          value: '{{product_ref}}',
        },
      ],
      assign_assets_to: [
        {
          attribute: 'model_pictures',
          mode: 'replace',
        },
      ],
    },
  ],
  transformations: [
    {
      label: 'Thumbnail plus black and white transformation',
      filename_suffix: '_thumbnailBW',
      source: {
        attribute: 'main_image',
        channel: null,
        locale: null,
      },
      target: {
        attribute: 'thumbnail',
        channel: null,
        locale: null,
      },
      operations: [
        {
          type: 'thumbnail',
          parameters: {
            width: 150,
            height: 150,
          },
        },
        {
          type: 'colorspace',
          parameters: {
            colorspace: 'grey',
          },
        },
      ],
    },
  ],
  sharing_enabled: true,
};

export default {
  get: assetFamilyMock,
  list: {
    _embedded: { items: [assetFamilyMock] },
    current_page: 1,
    _links: {
      self: { href: '/api/rest/v1/asset-families?page=1&limit=10' },
      first: { href: '/api/rest/v1/asset-families?limit=10' },
    },
  },
};
