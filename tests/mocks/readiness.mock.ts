import { Readiness } from '../../src';

const readinessMock: Readiness = {
  code: 'ecommerce_readiness',
  labels: { en_US: 'Ecommerce readiness' },
  channels_and_locales: { ecommerce: ['en_US', 'fr_FR'] },
  locale_fallbacks: [{ source: 'fr_FR', target: 'en_US' }],
  product_selection_conditions: [{ field: 'family', operator: 'IN', value: ['tshirts'] }],
  selection_level: 'all_levels',
  requirements: [{ field: 'name', operator: 'NOT EMPTY' }],
  is_draft: false,
  created_at: '2026-01-15T10:00:00+00:00',
  updated_at: '2026-01-16T10:00:00+00:00',
};

export default {
  get: readinessMock,
  list: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/readiness?page=1&limit=10' },
      first: { href: 'https://akeneo.test/api/rest/v1/readiness?page=1&limit=10' },
    },
    current_page: 1,
    items_count: 1,
    _embedded: { items: [readinessMock] },
  },
};
