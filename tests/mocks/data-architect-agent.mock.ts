import { ModelizationSuggestion } from '../../src';

const modelizationSuggestionMock: ModelizationSuggestion = {
  uuid: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e',
  source: 'api',
  author: 'john.doe',
  created_at: '2026-01-01T12:00:00Z',
  suggested_attributes: [{ code: 'material', type: 'pim_catalog_text', description: 'The material of the product' }],
};

export default {
  create: modelizationSuggestionMock,
  get: modelizationSuggestionMock,
  approve: { created: ['material'], skipped: [], errors: {} },
  list: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/data-model-designer/modelization-suggestions?page=1&limit=10' },
      first: { href: 'https://akeneo.test/api/rest/v1/data-model-designer/modelization-suggestions?page=1&limit=10' },
    },
    current_page: 1,
    items_count: 1,
    _embedded: { items: [modelizationSuggestionMock] },
  },
};
