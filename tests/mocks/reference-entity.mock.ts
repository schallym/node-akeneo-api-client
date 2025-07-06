import {
  ReferenceEntity,
  ReferenceEntityAttribute,
  ReferenceEntityAttributeOption,
  ReferenceEntityAttributeType,
} from '../../src/types';

const referenceEntityMock: ReferenceEntity = {
  _links: {
    image_download: {
      href: '/api/rest/v1/reference-entities/brand/image',
    },
  },
  code: 'brand',
  labels: { en_US: 'Brand' },
  image: 'brand.png',
};

const referenceEntityAttributeMock: ReferenceEntityAttribute = {
  code: 'color',
  type: ReferenceEntityAttributeType.TEXT,
  labels: { en_US: 'Color' },
  value_per_locale: true,
  value_per_channel: false,
  is_required_for_completeness: true,
  max_characters: 255,
  is_textarea: false,
  is_rich_text_editor: false,
  validation_rule: '',
  validation_regexp: '',
};

const referenceEntityAttributeOptionMock: ReferenceEntityAttributeOption = {
  code: 'red',
  labels: { en_US: 'Red' },
};

const referenceEntityRecordMock = {
  code: 'brand1',
  values: {
    color: {
      locale: 'en_US',
      channel: null,
      data: 'Red',
    },
  },
  created: '2023-10-01T12:00:00Z',
  updated: '2023-10-01T12:00:00Z',
};

export default {
  get: referenceEntityMock,
  list: [referenceEntityMock],
  attribute: {
    get: referenceEntityAttributeMock,
    list: {
      _embedded: { items: [referenceEntityAttributeMock] },
      current_page: 1,
      _links: {
        self: { href: '/api/rest/v1/reference-entities/brand/attributes?page=1&limit=10' },
        first: { href: '/api/rest/v1/reference-entities/brand/attributes?limit=10' },
      },
    },
    attributeOption: {
      get: referenceEntityAttributeOptionMock,
      list: [referenceEntityAttributeOptionMock],
    },
  },
  record: {
    get: referenceEntityRecordMock,
    list: {
      _embedded: { items: [referenceEntityRecordMock] },
      current_page: 1,
      _links: {
        self: { href: '/api/rest/v1/reference-entities/brand/records?page=1&limit=10' },
        first: { href: '/api/rest/v1/reference-entities/brand/records?limit=10' },
      },
    },
  },
};
