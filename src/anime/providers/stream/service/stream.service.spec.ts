import { Test, TestingModule } from '@nestjs/testing';
import { StreamService } from './stream.service';
import { HttpModule } from '@nestjs/axios'
import { SharedModule } from '../../../../shared/shared.module'

describe('StreamService', () => {
  let service: StreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedModule],
    }).compile();

    service = module.get<StreamService>(StreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
