import { Asset, AssetAttribute, AssetAttributeOption, AssetAttributeType, AssetFamily } from '../../src/types';

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

const assetAttributeMock: AssetAttribute = {
  code: 'model_is_wearing_size',
  labels: {
    en_US: 'Model is wearing size',
    fr_FR: 'Le mannequin porte la taille',
  },
  type: AssetAttributeType.SINGLE_OPTION,
  value_per_locale: false,
  value_per_channel: false,
  is_required_for_completeness: true,
  is_read_only: false,
};

const assetAttributeOptionMock: AssetAttributeOption = {
  code: 'size_s',
  labels: {
    en_US: 'Size S',
    fr_FR: 'Taille S',
  },
};

const AssetMock: Asset = {
  code: 'sku_54628_picture1',
  values: {
    media_preview: [
      {
        locale: null,
        channel: null,
        data: 'sku_54628_picture1.jpg',
      },
    ],
    model_wears_size: [
      {
        locale: null,
        channel: null,
        data: 's',
      },
    ],
    photographer: [
      {
        locale: null,
        channel: null,
        data: 'ben_levy',
      },
    ],
    main_colors: [
      {
        locale: null,
        channel: null,
        data: ['red', 'purple'],
      },
    ],
    end_of_use_date: [
      {
        locale: null,
        channel: null,
        data: '02/03/2021',
      },
    ],
  },
  created: '2021-05-31T09:23:34+00:00',
  updated: '2021-05-31T09:23:34+00:00',
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
  attribute: {
    get: assetAttributeMock,
    list: [assetAttributeMock],
    option: {
      get: assetAttributeOptionMock,
      list: [assetAttributeOptionMock],
    },
  },
  asset: {
    get: AssetMock,
    list: {
      _embedded: { items: [AssetMock] },
      current_page: 1,
      _links: {
        self: { href: '/api/rest/v1/asset-families/model_pictures/assets?page=1&limit=10' },
        first: { href: '/api/rest/v1/asset-families/model_pictures/assets?limit=10' },
      },
    },
  },
};
