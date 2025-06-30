import { VariantFamily } from '../../src/types';

const variantFamilyMock: VariantFamily = {
  code: 'tables',
  labels: {
    en_US: 'Tables',
    fr_FR: 'Tables',
  },
  variant_attribute_sets: [
    {
      level: 1,
      axes: ['size', 'color'],
      attributes: ['description'],
    },
  ],
};

export default {
  getVariantFamily: variantFamilyMock,
  updateCreateSeveralVariantFamilies: [
    {
      line: 1,
      code: 'variantFamily1',
      status_code: 201,
      message: 'Variant family variantFamily1 created successfully.',
    },
    {
      line: 2,
      code: 'variantFamily2',
      status_code: 201,
      message: 'Variant family variantFamily2 created successfully.',
    },
  ]
    .map((item) => JSON.stringify(item))
    .join('\n'),
  listVariantFamilies: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/products?page=2' },
      first: { href: 'https://akeneo.test/api/rest/v1/products' },
    },
    current_page: 1,
    _embedded: {
      items: [variantFamilyMock],
    },
  },
};
