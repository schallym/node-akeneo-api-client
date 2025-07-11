import { AttributeOption } from '../../src';

const attributeOptionMock: AttributeOption = {
  code: 'color_red',
  attribute: 'color',
  labels: {
    en_US: 'Red',
    fr_FR: 'Rouge',
  },
  sort_order: 1,
};

export default {
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
