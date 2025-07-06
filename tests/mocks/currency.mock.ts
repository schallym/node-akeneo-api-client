import { Currency } from '../../src/types';

const currencyMock: Currency = {
  code: 'en_US',
  enabled: true,
  label: 'US Dollar',
};

export default {
  get: currencyMock,
  list: {
    _embedded: { items: [currencyMock] },
    current_page: 1,
    _links: {
      self: { href: '/api/rest/v1/currencies?page=1&limit=10' },
      first: { href: '/api/rest/v1/currencies?limit=10' },
    },
  },
};
