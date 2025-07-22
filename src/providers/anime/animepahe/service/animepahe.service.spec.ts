import { Test, TestingModule } from '@nestjs/testing';
import { AnimepaheService } from './animepahe.service.js';
import { SharedModule } from '../../../../shared/shared.module.js';
import { animepaheFetch } from './animepahe.fetch.service.js';
import { animepaheSelect } from '../types/types.js';

jest.setTimeout(30000);

describe('AnimepaheService', () => {
  let service: AnimepaheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<AnimepaheService>(AnimepaheService);
  });

  it('fetch info', async () => {
    try {
      const id = 21;
      const data = await service.getAnimepaheByAnilist(id, animepaheSelect);
      expect(data).toBeDefined();
    } catch (err) {
      throw new Error(`Animepahe API failed info test: ${err.message}`);
    }
  });

  it('fetch watch', async () => {
    try {
      const id = 21;
      const data = await service.getAnimepaheByAnilist(id, animepaheSelect);
      const watchId = data?.episodes[0].id ?? '';
      const watch = await animepaheFetch.getSources(watchId);
      expect(watch).toBeDefined();
    } catch (err) {
      throw new Error(`Animepahe API failed watch test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
