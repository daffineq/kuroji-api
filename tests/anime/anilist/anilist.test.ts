import { describe, expect, it } from 'bun:test';
import { Anilist } from 'src/core/anime';

describe('Anilist Test', () => {
  const id = 162804;

  it('Get Info', async () => {
    const info = await Anilist.getInfo(id);

    expect(info).toBeTruthy();
  });
});
