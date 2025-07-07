import { AssetManagerApi } from './asset-manager-api.service';
import { AkeneoApiClient } from '../akeneo-api-client';
import { AssetAttributesApi, AssetFamiliesApi, AssetMediaFilesApi, AssetsApi } from './asset-manager';

jest.mock('./asset-manager/asset-families-api.service');

describe('AssetManager', () => {
  const mockClient = {} as AkeneoApiClient;

  beforeEach(() => {
    (AssetFamiliesApi as jest.Mock).mockClear();
  });

  it('should initialize assetFamilies with AssetFamiliesApi', () => {
    const manager = new AssetManagerApi(mockClient);

    expect(manager.families).toBeDefined();
    expect(manager.families).toBeInstanceOf(AssetFamiliesApi);
    expect(manager.attributes).toBeDefined();
    expect(manager.attributes).toBeInstanceOf(AssetAttributesApi);
    expect(manager.mediaFiles).toBeDefined();
    expect(manager.mediaFiles).toBeInstanceOf(AssetMediaFilesApi);
    expect(manager.assets).toBeDefined();
    expect(manager.assets).toBeInstanceOf(AssetsApi);
  });
});
