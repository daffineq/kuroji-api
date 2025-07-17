import { Test, TestingModule } from '@nestjs/testing';
import { KitsuService } from './kitsu.service.js';
import { SharedModule } from '../../../../shared/shared.module.js';

describe('KitsuService', () => {
  let service: KitsuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<KitsuService>(KitsuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
