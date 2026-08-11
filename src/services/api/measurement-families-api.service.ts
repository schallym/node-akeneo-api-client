import { AkeneoApiClient } from '../akeneo-api-client';
import { MeasurementFamily } from '../../types';

export type SeveralMeasurementFamiliesUpdateOrCreationResponseLine = {
  code: string;
  status_code: number;
  message?: string;
  errors?: {
    property: string;
    message: string;
  }[];
};

export type UpdateOrCreateMeasurementFamilyRequest = Partial<MeasurementFamily> &
  Required<Pick<MeasurementFamily, 'code'>>;

export class MeasurementFamiliesApi {
  private readonly endpoint: string;

  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/measurement-families';
  }

  async list(): Promise<MeasurementFamily[]> {
    return this.client.httpClient.get(this.endpoint).then((response) => response.data);
  }

  async updateOrCreateSeveral(
    data: UpdateOrCreateMeasurementFamilyRequest[],
  ): Promise<SeveralMeasurementFamiliesUpdateOrCreationResponseLine[]> {
    return this.client.httpClient.patch(`${this.endpoint}`, data).then((response) => {
      return response.data;
    });
  }
}
