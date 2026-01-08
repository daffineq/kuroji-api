import { describe, expect, it } from 'bun:test';
import { Tmdb, TmdbSeasons } from 'src/core/anime';

describe('TMDB Test', () => {
  const id = 162804;

  it('Get Info', async () => {
    const info = await Tmdb.getInfo(id);

    expect(info).toBeTruthy();
  });

  it('Get Episodes', async () => {
    const episodes = await TmdbSeasons.getEpisodes(id);

    expect(episodes).not.toBeEmpty();
  });
});
