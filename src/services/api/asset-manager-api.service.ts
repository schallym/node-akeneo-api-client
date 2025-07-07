import { AkeneoApiClient } from '../akeneo-api-client';
import { AssetAttributesApi, AssetFamiliesApi, AssetMediaFilesApi, AssetsApi } from './asset-manager';

export class AssetManagerApi {
  readonly families: AssetFamiliesApi;
  readonly attributes: AssetAttributesApi;
  readonly mediaFiles: AssetMediaFilesApi;
  readonly assets: AssetsApi;

  constructor(private readonly client: AkeneoApiClient) {
    this.families = new AssetFamiliesApi(this.client);
    this.attributes = new AssetAttributesApi(this.client);
    this.mediaFiles = new AssetMediaFilesApi(this.client);
    this.assets = new AssetsApi(this.client);
  }
}
