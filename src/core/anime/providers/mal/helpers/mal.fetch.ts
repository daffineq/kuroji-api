import env from 'src/config/env';
import { CrysolineWrapper, MALInfo } from 'src/core/types';
import { KurojiClient } from 'src/lib/http';

const client = new KurojiClient(`${env.CRYSOLINE}/api/anime/mal`);

const fetchInfo = async (id: number): Promise<MALInfo> => {
  const { data, error } = await client.get<CrysolineWrapper<MALInfo>>(`info/${id}`, {
    headers: {
      'x-api-key': env.CRYSOLINE_API_KEY
    }
  });

  if (error) {
    throw new Error(`Failed to fetch anime info: ${error.message}`);
  }

  if (!data?.data) {
    throw new Error(`Failed to fetch anime info: No data received`);
  }

  return data.data;
};

const MalFetch = {
  fetchInfo
};

export { MalFetch };
