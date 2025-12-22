import { describe, expect, it } from 'bun:test';
import { Kitsu } from 'src/core/anime';

describe('Kitsu Test', () => {
  const id = 162804;

  it('Get Info', async () => {
    const info = await Kitsu.getInfo(id);

    expect(info).toBeTruthy();
  });
});
