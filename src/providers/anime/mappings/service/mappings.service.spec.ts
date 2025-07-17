import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from '../../../../shared/shared.module.js';
import { MappingsService } from './mappings.service.js';

jest.setTimeout(30000);

describe('AnizipService', () => {
  let service: MappingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<MappingsService>(MappingsService);
  });

  it('fetch mapping', async () => {
    try {
      const id = 21;
      const data = await service.getMapping(id);
      expect(data).toBeDefined();
    } catch (err) {
      throw new Error(`Anizip API failed info test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
