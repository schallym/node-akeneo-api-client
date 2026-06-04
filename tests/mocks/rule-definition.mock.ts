import { RuleDefinition } from '../../src';

const ruleDefinitionMock: RuleDefinition = {
  code: 'set_brand',
  type: 'product',
  execution_type: 'triggered',
  enabled: true,
  priority: 0,
  reference_entity_identifier: null,
  labels: { en_US: 'Set brand' },
  conditions: [{ field: 'sku', operator: 'CONTAINS', value: 'AKN' }],
  actions: [{ type: 'set', field: 'brand', value: 'Akeneo' }],
  action_types: ['set'],
};

export default {
  get: ruleDefinitionMock,
  list: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/rule-definitions?page=1&limit=10' },
      first: { href: 'https://akeneo.test/api/rest/v1/rule-definitions?page=1&limit=10' },
    },
    current_page: 1,
    items_count: 1,
    _embedded: { items: [ruleDefinitionMock] },
  },
};
