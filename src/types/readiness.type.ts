export type ReadinessSelectionLevel = 'all_levels' | 'products_only' | 'product_models_only';

export type ReadinessLocaleFallback = {
  source: string;
  target: string;
};

export type ReadinessProductSelectionCondition = {
  field?: string;
  operator: string;
  value?: unknown;
  scope?: string | null;
  locale?: string | null;
};

export type ReadinessRequirement = {
  field?: string;
  operator: string;
  value?: unknown;
};

export type Readiness = {
  code: string;
  labels?: { [localeCode: string]: string };
  channels_and_locales: { [channelCode: string]: string[] };
  locale_fallbacks?: ReadinessLocaleFallback[];
  product_selection_conditions: ReadinessProductSelectionCondition[];
  selection_level?: ReadinessSelectionLevel;
  requirements: ReadinessRequirement[];
  is_draft?: boolean;
  created_at?: string;
  updated_at?: string;
};
