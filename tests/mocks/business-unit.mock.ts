import { BusinessUnit, CreateOrUpdateBusinessUnitRequest } from '../../src';

const businessUnitMock: BusinessUnit = {
  uuid: '019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b',
  code: 'ziggy_wear',
  labels: { en_US: 'Ziggy Wear', fr_FR: 'Ziggy Wear' },
  groups: ['Sales', 'Marketing'],
  roles: ['ROLE_USER', 'ROLE_CATALOG_MANAGER'],
  created_at: '2026-11-04T09:30:00+00:00',
  updated_at: null,
};

const otherBusinessUnitMock: BusinessUnit = {
  uuid: '019a2b3c-5e6f-7a80-9b1c-2d3e4f5a6b7c',
  code: 'ziggy_shoes',
  labels: { en_US: 'Ziggy Shoes' },
  groups: [],
  roles: [],
  created_at: '2026-11-04T09:31:00+00:00',
  updated_at: null,
};

const createOrUpdateRequest: CreateOrUpdateBusinessUnitRequest = {
  code: 'ziggy_wear',
  labels: { en_US: 'Ziggy Wear', fr_FR: 'Ziggy Wear' },
  groups: ['Sales', 'Marketing'],
  roles: ['ROLE_USER', 'ROLE_CATALOG_MANAGER'],
};

export default {
  get: businessUnitMock,
  list: [businessUnitMock, otherBusinessUnitMock],
  createOrUpdate: createOrUpdateRequest,
};
