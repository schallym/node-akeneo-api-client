/**
 * Decimal-precision settings of a conversion unit (`conversion_unit_precision` schema).
 * - `trim`: trailing zeros are trimmed, `decimal_places` is `null` or omitted.
 * - `round`: values are rounded to `decimal_places` (integer between 1 and 4).
 */
export type ConversionUnitPrecision =
  | null
  | {
      decimal_places_strategy: 'trim';
      decimal_places?: null;
    }
  | {
      decimal_places_strategy: 'round';
      decimal_places: number;
    };

/**
 * A per-locale conversion rule: either a unit code, or a unit code with decimal-precision settings.
 */
export type ConversionUnitLocaleRule =
  | string
  | {
      unit: string;
      decimal_places_strategy: 'trim';
      decimal_places?: null;
    }
  | {
      unit: string;
      decimal_places_strategy: 'round';
      decimal_places: number;
    };

/**
 * Per-locale conversion rules keyed by a code (measurement family code or attribute code), then locale code.
 */
export type ConversionUnitLocaleRules = {
  [code: string]: { [localeCode: string]: ConversionUnitLocaleRule } | null;
};

/**
 * Decimal-precision settings of the default conversion units, keyed by attribute code.
 */
export type ConversionUnitDefaultPrecision = {
  [attributeCode: string]: ConversionUnitPrecision;
};

/**
 * Units to which the given metric attributes should be converted when exporting products.
 * Keys are attribute codes mapped to a unit code, plus the optional `pim_config_*` rule keys.
 */
export type ChannelConversionUnits = {
  pim_config_family_rules?: ConversionUnitLocaleRules | null;
  pim_config_attribute_locale_rules?: ConversionUnitLocaleRules | null;
  pim_config_attribute_default_precision?: ConversionUnitDefaultPrecision | null;
  [attributeCode: string]: string | null | undefined | ConversionUnitLocaleRules | ConversionUnitDefaultPrecision;
};

export type Channel = {
  code: string;
  locales: string[];
  currencies: string[];
  category_tree: string;
  conversion_units?: ChannelConversionUnits;
  labels?: {
    [localeCode: string]: string;
  };
};
