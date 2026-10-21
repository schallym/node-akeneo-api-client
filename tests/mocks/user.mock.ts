import { User } from '../../src';

const userMock: User = {
  uuid: '6d1a5c4e-0f4a-4d3c-9a43-2b1c3c1c2a10',
  email: 'julia@example.com',
  enabled: true,
  first_name: 'Julia',
  last_name: 'Stark',
  roles: ['ROLE_ADMINISTRATOR', 'ROLE_USER'],
  groups: ['IT support'],
};

export default {
  get: userMock,
  list: {
    _embedded: { items: [userMock] },
    current_page: 1,
    _links: {
      self: { href: '/api/rest/v1/users?page=1&limit=10' },
      first: { href: '/api/rest/v1/users?limit=10' },
    },
  },
};
