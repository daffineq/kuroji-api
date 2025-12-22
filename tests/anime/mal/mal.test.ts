import { describe, expect, it } from 'bun:test';
import { MyAnimeList } from 'src/core/anime';

describe('MyAnimeList Test', () => {
  const id = 162804;

  it('Get Info', async () => {
    const info = await MyAnimeList.getInfo(id);

    expect(info).toBeTruthy();
  });
});
