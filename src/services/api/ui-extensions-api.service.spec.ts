import { CreateUIExtensionRequest, UIExtensionsApi } from './ui-extensions-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { UIExtension, UIExtensionPosition, UIExtensionType } from '../../types';

describe('UIExtensionsApi', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  const mockClient = {
    httpClient: mockHttpClient,
  } as unknown as AkeneoApiClient;

  let api: UIExtensionsApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new UIExtensionsApi(mockClient);
  });

  it('should list UI extensions', async () => {
    const mockExtensions: UIExtension[] = [
      {
        uuid: '1',
        name: 'Ext1 Updated',
        position: UIExtensionPosition.PRODUCT_HEADER,
        type: UIExtensionType.ACTION,
        status: 'active',
        configuration: {
          url: 'https://example.com',
          default_label: 'Updated Label',
          labels: { en_US: 'Updated Label', fr_FR: 'Étiquette mise à jour' },
        },
      },
    ];
    mockHttpClient.get.mockResolvedValue({ data: mockExtensions });

    const result = await api.list();
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/rest/v1/ui-extensions');
    expect(result).toEqual(mockExtensions);
  });

  it('should create a UI extension', async () => {
    const createData: CreateUIExtensionRequest = {
      name: 'Ext2',
      position: UIExtensionPosition.PRODUCT_HEADER,
      type: UIExtensionType.LINK,
      configuration: {
        url: 'https://example.com',
        default_label: 'Default Label',
        labels: { en_US: 'Default Label', fr_FR: 'Étiquette par défaut' },
      },
    };
    const created: UIExtension = { uuid: '2', status: 'inactive', ...createData };
    mockHttpClient.post.mockResolvedValue({ data: created });

    const result = await api.create(createData);
    expect(mockHttpClient.post).toHaveBeenCalledWith('/api/rest/v1/ui-extensions', createData);
    expect(result).toEqual(created);
  });

  it('should update a UI extension', async () => {
    const updateData = { uuid: '1', name: 'Ext1 Updated' };
    const updated: Partial<UIExtension> = {
      uuid: '1',
      name: 'Ext1 Updated',
      position: UIExtensionPosition.PRODUCT_HEADER,
      type: UIExtensionType.ACTION,
      configuration: {
        url: 'https://example.com',
        default_label: 'Updated Label',
        labels: { en_US: 'Updated Label', fr_FR: 'Étiquette mise à jour' },
      },
    };
    mockHttpClient.patch.mockResolvedValue({ data: updated });

    const result = await api.update(updateData);
    expect(mockHttpClient.patch).toHaveBeenCalledWith('/api/rest/v1/ui-extensions/1', updateData);
    expect(result).toEqual(updated);
  });

  it('should delete a UI extension', async () => {
    mockHttpClient.delete.mockResolvedValue({});

    await expect(api.delete('1')).resolves.toBeUndefined();
    expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/rest/v1/ui-extensions/1');
  });
});
