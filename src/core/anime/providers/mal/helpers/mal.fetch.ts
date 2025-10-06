import env from 'src/config/env';
import { CrysolineWrapper, MALInfo } from 'src/core/types';
import { Client } from 'src/helpers/client';

class MalFetch extends Client {
  constructor() {
    super(`${env.CRYSOLINE}/api/anime/mal`);
  }

  async fetchInfo(id: number): Promise<MALInfo> {
    const { data, error } = await this.client.get<CrysolineWrapper<MALInfo>>(`info/${id}`, {
      headers: {
        'x-api-key': env.CRYSOLINE_API
      }
    });

    if (error) {
      throw new Error(`Failed to fetch anime info: ${error.message}`);
    }

    if (!data?.data) {
      throw new Error(`Failed to fetch anime info: No data received`);
    }

    return data.data;
  }
}

const malFetch = new MalFetch();

export default malFetch;
