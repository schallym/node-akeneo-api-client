import { MeasurementFamily } from '../../src';

const measurementFamilyMock: MeasurementFamily = {
  code: 'weight',
  labels: { en_US: 'Weight' },
  standard_unit_code: 'KILOGRAM',
  units: {
    KILOGRAM: {
      code: 'KILOGRAM',
      labels: { en_US: 'Kilogram' },
      symbol: 'kg',
      convert_from_standard: [{ operator: 'mul', value: '1' }],
    },
  },
};

export default {
  get: measurementFamilyMock,
  updateCreateSeveral: [
    { code: 'weight', status_code: 201 },
    { code: 'length', status_code: 204 },
  ],
};
