import { Test, TestingModule } from '@nestjs/testing';
import { TvdbTokenService } from './tvdb.token.service.js';
import { SharedModule } from '../../../../../shared/shared.module.js';

describe('TvdbTokenService', () => {
  let service: TvdbTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<TvdbTokenService>(TvdbTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
