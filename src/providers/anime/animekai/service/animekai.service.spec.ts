import { Test, TestingModule } from '@nestjs/testing';
import { AnimekaiService } from './animekai.service.js';
import { SharedModule } from '../../../../shared/shared.module.js';
import { animekaiFetch } from './animekai.fetch.service.js';
import { animeKaiSelect } from '../types/types.js';

jest.setTimeout(30000);

describe('AnimekaiService', () => {
  let service: AnimekaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<AnimekaiService>(AnimekaiService);
  });

  it('fetch info', async () => {
    try {
      const id = 21;
      const data = await service.getAnimekaiByAnilist(id, animeKaiSelect);
      expect(data).toBeDefined();
    } catch (err) {
      throw new Error(`Animekai API failed info test: ${err.message}`);
    }
  });

  it('fetch watch', async () => {
    try {
      const id = 21;
      const data = await service.getAnimekaiByAnilist(id, animeKaiSelect);
      const watch = await animekaiFetch.getSources(data.episodes[0].id, false);
      expect(watch).toBeDefined();
    } catch (err) {
      throw new Error(`Animekai API failed watch test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
