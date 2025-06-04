import { Test, TestingModule } from '@nestjs/testing';
import { AnimekaiService } from './animekai.service';
import { SharedModule } from '../../../../shared/shared.module';
import { AnimeKaiHelper } from '../utils/animekai-helper';

jest.setTimeout(30000);

describe('AnimekaiService', () => {
  let service: AnimekaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [AnimekaiService, AnimeKaiHelper],
    }).compile();

    service = module.get<AnimekaiService>(AnimekaiService);
  });

  it('fetch info', async () => {
    try {
      const id = 21;
      const data = await service.getAnimekaiByAnilist(id);
      expect(data).toBeDefined();
    } catch (err) {
      throw new Error(`Animekai API failed info test: ${err.message}`);
    }
  });

  it('fetch watch', async () => {
    try {
      const id = 21;
      const data = await service.getAnimekaiByAnilist(id);
      const watch = await service.getSources(data.episodes[0].id, false);
      expect(watch).toBeDefined();
    } catch (err) {
      throw new Error(`Animekai API failed watch test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
