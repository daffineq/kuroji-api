import { describe, expect, it } from 'bun:test';
import { Tvdb } from 'src/core/anime';

describe('TVDB Test', () => {
  const id = 162804;

  it('Get Info', async () => {
    const info = await Tvdb.getInfo(id);

    expect(info).toBeTruthy();
  });
});
