import { Test, TestingModule } from '@nestjs/testing';
import { AnilibriaService } from './anilibria.service.js';

describe('AnilibriaService', () => {
  let service: AnilibriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnilibriaService],
    }).compile();

    service = module.get<AnilibriaService>(AnilibriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
