import { AssociationType } from '../../src';

const automaticAssociationTypeMock: AssociationType = {
  code: 'compatible_with',
  labels: { en_US: 'Compatible with' },
  is_quantified: false,
  is_two_way: false,
  rule: {
    enabled: true,
    base_product_selection: {
      operator: 'AND',
      criteria: [{ field: 'family', operator: 'IN', value: ['phones'] }],
    },
    compatible_product_selection: {
      operator: 'OR',
      criteria: [{ field: 'categories', operator: 'IN', value: ['accessories'], scope: null, locale: null }],
    },
    condition_groups: {
      operator: 'AND',
      conditions: [
        {
          base_attribute: { attribute_code: 'connector_type', scope: null, locale: null },
          operator: '=',
          compatible_attribute: { attribute_code: 'connector_type', scope: null, locale: null },
        },
        {
          base_attribute: { attribute_code: 'brand', record_attribute_code: 'name' },
          operator: 'matches_any',
          compatible_attribute: { attribute_code: 'supported_brands', scope: 'ecommerce', locale: 'en_US' },
        },
      ],
    },
  },
};

const recordAssociationTypeMock: AssociationType = {
  code: 'fits_vehicle',
  labels: { en_US: 'Fits vehicle' },
  is_quantified: false,
  is_two_way: false,
  rule: {
    enabled: true,
    base_product_selection: {
      operator: 'AND',
      criteria: [{ field: 'family', operator: 'IN', value: ['tyres'] }],
    },
    compatible_record_selection: {
      reference_entity_code: 'vehicle',
      operator: 'AND',
      criteria: [{ field: 'make', operator: 'IN', value: ['ford'], scope: null, locale: null }],
    },
    condition_groups: {
      operator: 'AND',
      conditions: [
        {
          base_attribute: { attribute_code: 'diameter', scope: null, locale: null, record_attribute_code: null },
          operator: '=',
          compatible_attribute: {
            attribute_code: 'rim_diameter',
            scope: null,
            locale: null,
            record_attribute_code: null,
          },
        },
      ],
    },
  },
};

const manualAssociationTypeMock: AssociationType = {
  code: 'X_SELL',
  labels: { en_US: 'Cross sell' },
  is_quantified: false,
  is_two_way: false,
  rule: null,
};

export default {
  get: automaticAssociationTypeMock,
  getWithRecordSelection: recordAssociationTypeMock,
  list: {
    _links: {
      self: { href: 'https://demo.akeneo.com/api/rest/v1/association-types?page=1&limit=10' },
      first: { href: 'https://demo.akeneo.com/api/rest/v1/association-types?page=1&limit=10' },
    },
    current_page: 1,
    _embedded: {
      items: [manualAssociationTypeMock, automaticAssociationTypeMock, recordAssociationTypeMock],
    },
  },
};
