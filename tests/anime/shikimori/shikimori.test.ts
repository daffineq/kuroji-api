import { describe, expect, it } from 'bun:test';
import { Shikimori } from 'src/core/anime';

describe('Shikimori Test', () => {
  const id = 162804;

  it('Get Info', async () => {
    const info = await Shikimori.getInfo(id);

    expect(info).toBeTruthy();
  });
});
