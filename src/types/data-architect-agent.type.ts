export type ModelizationSuggestionSource = 'manual' | 'api' | 'import';

export type ModelizationSuggestionStatus = 'generating' | 'draft' | 'applied' | 'declined' | 'failed';

export type SuggestedAttribute = {
  code?: string | null;
  type?: string | null;
  description?: string | null;
};

export type ModelizationSuggestion = {
  uuid?: string;
  source?: ModelizationSuggestionSource;
  author?: string;
  created_at?: string;
  suggested_attributes?: SuggestedAttribute[];
};
