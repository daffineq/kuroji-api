import { Test, TestingModule } from '@nestjs/testing';
import { ShikimoriService } from './shikimori.service.js';
import { SharedModule } from '../../../../shared/shared.module.js';
import { shikimoriSelect } from '../types/types.js';

describe('ShikimoriService', () => {
  let service: ShikimoriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<ShikimoriService>(ShikimoriService);
  });

  it('fetch info', async () => {
    try {
      const id = '21';
      const data = await service.getInfo(id, shikimoriSelect);
      expect(data).toBeDefined();
    } catch (err) {
      throw new Error(`Shikimori API failed info test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
