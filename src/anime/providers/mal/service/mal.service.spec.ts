import { Test, TestingModule } from '@nestjs/testing';
import { MalService } from './mal.service';

describe('MalService', () => {
  let service: MalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MalService],
    }).compile();

    service = module.get<MalService>(MalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
