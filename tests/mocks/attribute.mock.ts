import { Attribute, AttributeOption, AttributeTypes } from '../../src';

const attributeOptionMock: AttributeOption = {
  code: 'color_red',
  attribute: 'color',
  labels: {
    en_US: 'Red',
    fr_FR: 'Rouge',
  },
  sort_order: 1,
};

const attributeWithMetadataMock: Attribute = {
  code: 'description',
  type: AttributeTypes.TEXTAREA,
  labels: { en_US: 'Description' },
  group: 'marketing',
  group_labels: { en_US: 'Marketing' },
  sort_order: 1,
  localizable: true,
  scopable: true,
  attribute_metadata: {
    webshop_position: 3,
    is_locked: true,
    erp_code: 'ABC-12',
    certifications: ['iso_9001', 'ce'],
    legacy_code: null,
  },
};

export default {
  getAttributeWithMetadata: attributeWithMetadataMock,
  listAttributesWithMetadata: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/attributes?page=1&limit=10&with_metadata=true' },
      first: { href: 'https://akeneo.test/api/rest/v1/attributes?page=1&limit=10&with_metadata=true' },
    },
    current_page: 1,
    _embedded: {
      items: [attributeWithMetadataMock],
    },
  },
  getAttributeOption: attributeOptionMock,
  updateCreateSeveralAttributeOptions: [
    {
      line: 1,
      code: 'attributeOption1',
      status_code: 200,
      message: 'Attribute option attributeOption1 updated successfully.',
    },
    {
      line: 2,
      code: 'attributeOption2',
      status_code: 201,
      message: 'Attribute option attributeOption2 created successfully.',
    },
  ]
    .map((item) => JSON.stringify(item))
    .join('\n'),
  listAttributeOptions: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/attributes/color/options?page=2' },
      first: { href: 'https://akeneo.test/api/rest/v1/attributes/color' },
    },
    current_page: 1,
    _embedded: {
      items: [attributeOptionMock],
    },
  },
};
