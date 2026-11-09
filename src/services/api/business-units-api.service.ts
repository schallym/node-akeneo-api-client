import { AkeneoApiClient } from '../akeneo-api-client';
import { BusinessUnit } from '../../types';

/**
 * Body of `POST /api/rest/v1/business-units`.
 * Labels set to `null` are removed; labels, groups and roles that are not given are kept on update.
 * When `roles` is empty or omitted, the business unit does not restrict the roles.
 */
export type CreateOrUpdateBusinessUnitRequest = Partial<Pick<BusinessUnit, 'labels' | 'groups' | 'roles'>> &
  Required<Pick<BusinessUnit, 'code'>>;

export class BusinessUnitsApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/business-units';
  }

  /** Get the list of all the business units (not paginated). */
  async list(): Promise<BusinessUnit[]> {
    return this.client.httpClient.get(this.endpoint).then((response) => response.data);
  }

  /** Create a new business unit, or update the business unit with the given code if it already exists. */
  async createOrUpdate(data: CreateOrUpdateBusinessUnitRequest): Promise<BusinessUnit> {
    return this.client.httpClient.post(this.endpoint, data).then((response) => response.data);
  }
}
