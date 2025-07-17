import { Test, TestingModule } from '@nestjs/testing';
import { StreamService } from './stream.service.js';
import { SharedModule } from '../../../../shared/shared.module.js';

describe('StreamService', () => {
  let service: StreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<StreamService>(StreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
