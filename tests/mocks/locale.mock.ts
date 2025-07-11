import { Locale } from '../../src';

const localeMock: Locale = {
  code: 'en_US',
  enabled: true,
};

export default {
  get: localeMock,
  list: {
    _embedded: {
      items: [localeMock],
    },
    current_page: 1,
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/locales?page=1&limit=10' },
      first: { href: 'https://akeneo.test/api/rest/v1/locales?limit=10' },
    },
  },
};
