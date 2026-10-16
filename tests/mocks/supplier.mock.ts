import { Supplier, SupplierUser } from '../../src';

const supplierMock: Supplier = {
  code: 'ERP-4471',
  name: 'Acme Corp',
  portal_uuid: '3f8a1b2c-4d5e-4f60-8a7b-9c0d1e2f3a4b',
  default_channel_code: 'ecommerce',
  default_locale_code: 'en_US',
  avatar_file_key: null,
};

const supplierUserMock: SupplierUser = {
  uuid: '9b2e7c1a-3d4f-4a5b-8c6d-7e8f9a0b1c2d',
  email: 'jane@acme.test',
  first_name: 'Jane',
  last_name: 'Doe',
  created_at: '2026-10-01T10:00:00+00:00',
  last_logged_in: null,
};

export default {
  supplier: {
    get: supplierMock,
    list: {
      _embedded: { items: [supplierMock] },
      current_page: 1,
      _links: {
        self: { href: '/api/rest/v1/suppliers?page=1&limit=10' },
        first: { href: '/api/rest/v1/suppliers?limit=10' },
      },
    },
  },
  user: {
    get: supplierUserMock,
    list: {
      _embedded: { items: [supplierUserMock] },
      current_page: 1,
      _links: {
        self: { href: '/api/rest/v1/suppliers/ERP-4471/users?page=1&limit=10' },
        first: { href: '/api/rest/v1/suppliers/ERP-4471/users?limit=10' },
      },
    },
    updateOrCreateSeveral: [
      { email: 'jane@acme.test', status_code: 204 },
      {
        email: 'invalid',
        status_code: 422,
        message: 'Validation failed.',
        errors: [{ property: 'email', message: 'This value is not a valid email address.' }],
      },
    ],
  },
};
