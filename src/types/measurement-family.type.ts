export type MeasurementFamily = {
  code: string;
  labels: { [localeCode: string]: string };
  standard_unit_code: string;
  units: { [unitCode: string]: MeasurementUnit };
};

export type MeasurementUnit = {
  code: string;
  labels: { [localeCode: string]: string };
  convert_from_standard: {
    operator: string;
    value: string;
  }[];
  symbol?: string;
};
