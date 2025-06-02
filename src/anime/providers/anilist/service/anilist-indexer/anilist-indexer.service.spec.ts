import { Test, TestingModule } from '@nestjs/testing';
import { AnilistIndexerService } from './anilist-indexer.service';
import { SharedModule } from '../../../../../shared/shared.module';

describe('ReleaseIndexerService', () => {
  let service: AnilistIndexerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<AnilistIndexerService>(AnilistIndexerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
