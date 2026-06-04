import {
  ApproveModelizationSuggestionRequest,
  CreateModelizationSuggestionRequest,
  DataArchitectAgentApi,
} from './data-architect-agent-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';

describe('DataArchitectAgentApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockClient = {
    httpClient: mockHttpClient,
  };

  let api: DataArchitectAgentApi;
  const uuid = 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e';

  beforeEach(() => {
    jest.clearAllMocks();
    api = new DataArchitectAgentApi(mockClient as unknown as AkeneoApiClient);
  });

  describe('createModelizationSuggestion', () => {
    it('should POST a modelization suggestion and return it', async () => {
      const data: CreateModelizationSuggestionRequest = { source: 'api', description: 'Need a material attribute' };
      const response = { uuid, source: 'api' };
      mockHttpClient.post.mockResolvedValue({ data: response });

      const result = await api.createModelizationSuggestion(data);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/rest/v1/data-model-designer/modelization-suggestion/attribute',
        data,
      );
      expect(result).toEqual(response);
    });
  });

  describe('getModelizationSuggestion', () => {
    it('should GET a modelization suggestion by uuid', async () => {
      const response = { uuid };
      mockHttpClient.get.mockResolvedValue({ data: response });

      const result = await api.getModelizationSuggestion(uuid);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}`,
      );
      expect(result).toEqual(response);
    });
  });

  describe('approveModelizationSuggestion', () => {
    it('should POST approval with data and return the result', async () => {
      const data: ApproveModelizationSuggestionRequest = {
        attribute_code: 'material',
        attribute_type: 'pim_catalog_text',
      };
      const response = { created: ['material'], skipped: [], errors: {} };
      mockHttpClient.post.mockResolvedValue({ data: response });

      const result = await api.approveModelizationSuggestion(uuid, data);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}/approve`,
        data,
      );
      expect(result).toEqual(response);
    });

    it('should default to an empty body when no data is provided', async () => {
      mockHttpClient.post.mockResolvedValue({ data: {} });

      await api.approveModelizationSuggestion(uuid);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}/approve`,
        {},
      );
    });
  });

  describe('declineModelizationSuggestion', () => {
    it('should POST decline with a reason', async () => {
      mockHttpClient.post.mockResolvedValue({});

      await api.declineModelizationSuggestion(uuid, { reject_reason: 'not needed' });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}/decline`,
        { reject_reason: 'not needed' },
      );
    });

    it('should default to an empty body when no data is provided', async () => {
      mockHttpClient.post.mockResolvedValue({});

      await api.declineModelizationSuggestion(uuid);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `/api/rest/v1/data-model-designer/modelization-suggestion/${uuid}/decline`,
        {},
      );
    });
  });

  describe('listModelizationSuggestions', () => {
    it('should GET a paginated list with params', async () => {
      const response = { _embedded: { items: [] }, current_page: 1, _links: {} };
      mockHttpClient.get.mockResolvedValue({ data: response });

      const result = await api.listModelizationSuggestions({ status: 'draft' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/data-model-designer/modelization-suggestions', {
        params: { status: 'draft' },
      });
      expect(result).toEqual(response);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'));

      await expect(api.listModelizationSuggestions()).rejects.toThrow('API error');
    });
  });
});
