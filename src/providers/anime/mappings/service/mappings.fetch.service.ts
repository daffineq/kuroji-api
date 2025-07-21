import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';
import { IAniZipData } from '../types/types.js';

export class MappingsFetchService extends Client {
  constructor() {
    super(UrlConfig.ANI_ZIP_BASE);
  }

  async fetchMapping(anilistId: number) {
    const { data, error } = await this.client.get<IAniZipData>(
      `mappings?anilist_id=${anilistId}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }
}

export const mappingsFetch = new MappingsFetchService();
