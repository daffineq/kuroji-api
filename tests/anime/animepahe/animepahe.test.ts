import { describe, expect, it } from 'bun:test';
import { Animepahe, AnimepaheFetch } from 'src/core/anime';

describe('Animepahe Test', () => {
  const id = 162804;

  it('Get Info', async () => {
    const info = await Animepahe.getInfo(id);

    expect(info).toBeTruthy();
  });

  it('Get Streaming', async () => {
    const sources = await AnimepaheFetch.getSources(
      '792f7df3-b74d-f848-3244-a4e9b6495d8f',
      '9e48452c7702dbdde90a4ea6d1ec3c38915e6e7cba4eccc15d22fd9c3c1c80e5'
    );

    expect(sources).toBeTruthy();
  });
});
