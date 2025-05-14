import { Test, TestingModule } from '@nestjs/testing';
import { AnimepaheService } from './animepahe.service';
import { AnimePaheHelper } from '../utils/animepahe-helper'
import { SharedModule } from '../../../../shared/shared.module'

jest.setTimeout(30000);

describe('AnimepaheService', () => {
  let service: AnimepaheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [AnimepaheService, AnimePaheHelper],
    }).compile();

    service = module.get<AnimepaheService>(AnimepaheService);
  });

  it('fetch info', async () => {
    try {
      const id = 21
      const data = await service.getAnimepaheByAnilist(id)
      expect(data).toBeDefined()
    } catch (err) {
      throw new Error(`Animepahe API failed info test: ${err.message}`);
    }
  })

  it('fetch watch', async () => {
    try {
      const id = 21
      const data = await service.getAnimepaheByAnilist(id)
      const watchId = data?.episodes[0].id ?? ''
      const watch = await service.getSources(watchId)
      expect(watch).toBeDefined()
    } catch (err) {
      throw new Error(`Animepahe API failed watch test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
