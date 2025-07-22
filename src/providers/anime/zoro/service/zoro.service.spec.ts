import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from '../../../../shared/shared.module.js';
import { ZoroService } from './zoro.service.js';
import { zoroFetch } from './zoro.fetch.service.js';
import { zoroSelect } from '../types/types.js';

jest.setTimeout(30000);

describe('ZoroService', () => {
  let service: ZoroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<ZoroService>(ZoroService);
  });

  it('fetch info', async () => {
    try {
      const id = 21;
      const data = await service.getZoroByAnilist(id, zoroSelect);
      expect(data).toBeDefined();
    } catch (err) {
      throw new Error(`Zoro API failed info test: ${err.message}`);
    }
  });

  it('fetch watch', async () => {
    try {
      const id = 21;
      const data = await service.getZoroByAnilist(id, zoroSelect);
      const watch = await zoroFetch.getSources(data.episodes[0].id, false);
      expect(watch).toBeDefined();
    } catch (err) {
      throw new Error(`Zoro API failed watch test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
