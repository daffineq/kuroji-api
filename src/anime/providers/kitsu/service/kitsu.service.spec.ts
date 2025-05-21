import { Test, TestingModule } from '@nestjs/testing';
import { KitsuService } from './kitsu.service';
import { SharedModule } from '../../../../shared/shared.module'

describe('KitsuService', () => {
  let service: KitsuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedModule],
    }).compile();

    service = module.get<KitsuService>(KitsuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
