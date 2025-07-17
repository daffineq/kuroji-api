import { Test, TestingModule } from '@nestjs/testing';
import { MalService } from './mal.service.js';
import { SharedModule } from '../../../../shared/shared.module.js';

describe('MalService', () => {
  let service: MalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<MalService>(MalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
